import { motion } from 'framer-motion';
import { Briefcase, Users, Shield, Zap } from 'lucide-react';

const About = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-3xl mx-auto mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-6 drop-shadow-sm">
                    Connecting Talent with <span className="text-zinc-900 dark:text-white">Opportunity</span></h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-300">
                    HireHive is the premier platform for tech professionals and top-tier companies. We bridge the gap between world-class talent and innovative organizations.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                <FeatureCard
                    icon={<Briefcase />}
                    title="Premium Jobs"
                    desc="Access exclusive opportunities at top companies worldwide."
                />
                <FeatureCard
                    icon={<Users />}
                    title="Global Talent"
                    desc="Recruiters reach thousands of qualified, vetted candidates."
                />
                <FeatureCard
                    icon={<Shield />}
                    title="Secure & Private"
                    desc="Your data is protected with enterprise-grade security."
                />
                <FeatureCard
                    icon={<Zap />}
                    title="Lightning Fast"
                    desc="Apply instantly with our streamlined one-click process."
                />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-zinc-800 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 md:p-12 dark:border-zinc-200 shadow-sm dark:shadow-none relative overflow-hidden"
            >



                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">Our Mission</h2>
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-4xl text-lg">
                        At HireHive, we believe that finding the right job or the right candidate shouldn't be a struggle. Our platform is built on transparency, efficiency, and a commitment to helping careers thrive in the modern tech ecosystem. Whether you're a junior developer looking for your first role, or a seasoned CTO building a unicorn, HireHive is designed to accelerate your journey.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-zinc-800 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-lg dark:border-zinc-200 shadow-sm dark:shadow-none hover:border-blue-200 dark:hover:border-blue-200 dark:border-blue-800 transition-all group"
    >
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
    </motion.div>
);

export default About;
