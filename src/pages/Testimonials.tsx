import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = ({ name, role, company, content, rating, delay }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -10, rotateX: 5, rotateY: 5, scale: 1.02 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col relative transform-gpu perspective-1000"
            style={{ transformStyle: 'preserve-3d' }}
        >
            <Quote className="absolute top-6 right-8 w-12 h-12 text-slate-100 dark:text-slate-700 transform translate-z-[-10]" />

            <div className="flex gap-1 mb-6 transform translate-z-10">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-[#ff9800] fill-current' : 'text-slate-300 dark:text-slate-600'}`} />
                ))}
            </div>

            <p className="text-slate-700 dark:text-slate-300 italic mb-8 flex-1 text-lg leading-relaxed transform translate-z-5">
                "{content}"
            </p>

            <div className="flex items-center gap-4 transform translate-z-15">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1976d2] to-[#9c27b0] flex items-center justify-center text-white font-bold text-lg shadow-inner">
                    {name.charAt(0)}
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{role}, {company}</p>
                </div>
            </div>
        </motion.div>
    );
};

const Testimonials = () => {
    const testimonials = [
        {
            name: "Ahmed Al Mansoori",
            role: "Operations Director",
            company: "Dubai Logistics Co.",
            content: "BizApp365 completely transformed how we handle our supply chain. The real-time synchronization between the material center and accounts has saved us hundreds of man-hours.",
            rating: 5,
            delay: 0.1
        },
        {
            name: "Sarah Jenkins",
            role: "Chief Financial Officer",
            company: "TechRetail UAE",
            content: "The UAE E-Invoicing integration worked flawlessly out of the box. Filing our VAT returns has never been easier. The multi-tenant architecture is perfect for our 3 subsidiaries.",
            rating: 5,
            delay: 0.2
        },
        {
            name: "Mohammed Tariq",
            role: "HR Manager",
            company: "BuildCorp LLC",
            content: "Managing payroll for 500+ employees with various allowances and UAE labor law compliance used to be a nightmare. The HR module simplifies everything into a few clicks.",
            rating: 4,
            delay: 0.3
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                        Trusted by <span className="text-[#2e7d32]">Industry Leaders</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-balance">
                        Don't just take our word for it. Here is what our clients have to say about their experience with BizApp365.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
                    {testimonials.map((testimonial, idx) => (
                        <TestimonialCard key={idx} {...testimonial} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
