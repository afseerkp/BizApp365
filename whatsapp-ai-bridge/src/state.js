// In-memory state: conversation history, duplicate filter, rate limiter and per-user queue.
// Fine for a single server instance. For several instances, move these to Redis.

/** Keeps the last few user/assistant turns per phone number, forgotten after a period of silence. */
export class ConversationStore {
  constructor({ maxMessages, ttlMs }) {
    this.maxMessages = maxMessages;
    this.ttlMs = ttlMs;
    this.map = new Map();
  }

  get(user) {
    const item = this.map.get(user);
    if (!item) return [];
    if (Date.now() - item.updatedAt > this.ttlMs) {
      this.map.delete(user);
      return [];
    }
    return [...item.messages];
  }

  append(user, ...messages) {
    const all = [...this.get(user), ...messages].slice(-this.maxMessages);
    this.map.set(user, { messages: all, updatedAt: Date.now() });
    this.#prune();
  }

  reset(user) {
    this.map.delete(user);
  }

  #prune() {
    if (this.map.size < 1000) return;
    const now = Date.now();
    for (const [user, item] of this.map) if (now - item.updatedAt > this.ttlMs) this.map.delete(user);
  }
}

/** Meta retries webhooks, so the same message id can arrive more than once. */
export class Deduper {
  constructor(ttlMs = 24 * 60 * 60_000) {
    this.ttlMs = ttlMs;
    this.seen = new Map();
  }

  /** Returns true the first time an id is seen, false for repeats. */
  firstTime(id) {
    const now = Date.now();
    if (this.seen.has(id) && now - this.seen.get(id) < this.ttlMs) return false;
    this.seen.set(id, now);
    if (this.seen.size > 10_000) {
      for (const [key, at] of this.seen) if (now - at >= this.ttlMs) this.seen.delete(key);
    }
    return true;
  }
}

/** Sliding-window limit per phone number, to protect your AI quota from spam. */
export class RateLimiter {
  constructor({ limit, windowMs }) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.hits = new Map();
  }

  /** `allowed`: process the message. `firstBlocked`: true only for the first blocked message in a window. */
  check(user) {
    const now = Date.now();
    const recent = (this.hits.get(user) ?? []).filter((t) => now - t < this.windowMs);
    const allowed = recent.length < this.limit;
    const firstBlocked = !allowed && recent.length === this.limit;
    recent.push(now);
    this.hits.set(user, recent);
    return { allowed, firstBlocked };
  }
}

/** Runs tasks one after another per key, so two quick messages from one user don't race each other. */
export class KeyedQueue {
  constructor() {
    this.tails = new Map();
  }

  run(key, task) {
    const previous = this.tails.get(key) ?? Promise.resolve();
    const next = previous.then(task, task);
    const tail = next.catch(() => {});
    this.tails.set(key, tail);
    tail.then(() => {
      if (this.tails.get(key) === tail) this.tails.delete(key);
    });
    return next;
  }
}
