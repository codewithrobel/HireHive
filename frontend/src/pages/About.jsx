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
                    Connecting Talent with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">Opportunity</span>
                </h1>
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
                className="bg-white/60 dark:bg-white/5 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

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
        className="bg-white/60 dark:bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm dark:shadow-none hover:border-blue-200 dark:hover:border-blue-500/30 transition-all group"
    >
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
    </motion.div>
);

export default About;
