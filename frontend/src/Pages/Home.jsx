import {
    TreePine,
    Shield,
    BarChart3,
    Users,
    ArrowRight,
    Star,
    Award,
    Globe,
    Zap,
    CheckCircle,
    Quote,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] relative overflow-hidden">
            {/* Consistent Background Elements for entire page */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Primary gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/90 via-[#1E293B]/80 to-[#0F172A]/90"></div>

                {/* Consistent floating orbs - positioned symmetrically */}
                <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-[#22C55E]/20 to-[#16A34A]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-[#16A34A]/20 to-[#22C55E]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-[#34D399]/15 to-[#22C55E]/10 rounded-full blur-3xl animate-pulse delay-500"></div>

                {/* Consistent gradient mesh overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#22C55E]/5 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#16A34A]/3 to-transparent"></div>

                {/* Subtle grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, #22C55E 1px, transparent 0)",
                        backgroundSize: "50px 50px",
                    }}
                ></div>
            </div>

            {/* Hero Section */}
            <div className="relative min-h-screen flex items-center pt-20 md:pt-0">
                <div className="relative container mx-auto px-4 py-20 z-10">
                    <div className="text-center text-white max-w-6xl mx-auto">
                        {/* Enhanced Logo Section */}
                        <div className="flex justify-center mb-8">
                            <div className="relative group">
                                <TreePine className="h-24 w-24 text-[#22C55E] animate-bounce drop-shadow-2xl" />
                                <div className="absolute -inset-6 bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500"></div>
                                <div className="absolute -inset-2 bg-[#22C55E] rounded-full opacity-10 blur-xl animate-ping"></div>

                                {/* Orbiting elements */}
                                <div className="absolute -top-2 -right-2 w-3 h-3 bg-[#34D399] rounded-full animate-spin"></div>
                                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-[#22C55E] rounded-full animate-spin delay-500"></div>
                            </div>
                        </div>

                        {/* Enhanced Title with Better Typography */}
                        <div className="mb-8">
                            <h1 className="text-6xl md:text-8xl font-bold mb-4 font-amita bg-gradient-to-r from-[#22C55E] via-[#34D399] to-[#16A34A] bg-clip-text text-transparent animate-pulse">
                                वन रक्षक
                            </h1>
                            <div className="h-1 w-32 bg-gradient-to-r from-[#22C55E] to-[#16A34A] mx-auto rounded-full shadow-lg shadow-green-500/50"></div>
                        </div>

                        {/* Enhanced Description with Better Spacing */}
                        <div className="mb-12">
                            <p className="text-xl md:text-2xl mb-4 max-w-4xl mx-auto opacity-90 leading-relaxed font-light">
                                Revolutionary{" "}
                                <span className="text-[#22C55E] font-semibold">
                                    AI-powered
                                </span>{" "}
                                forest monitoring system
                            </p>
                            <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-75 leading-relaxed">
                                that detects and classifies sounds to protect
                                our natural environments from illegal activities
                                and preserve biodiversity.
                            </p>
                        </div>

                        {/* Enhanced CTA Button */}
                        <div className="flex justify-center mb-16">
                            <Link
                                to="/dashboard"
                                className="group relative bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white px-12 py-6 rounded-2xl font-bold hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-500 flex items-center justify-center space-x-3 transform hover:scale-105 hover:-translate-y-1"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <span className="relative z-10">
                                    Open Dashboard
                                </span>
                                <ArrowRight className="relative z-10 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                            </Link>
                        </div>

                        {/* Enhanced Trust Indicators */}
                        <div className="flex flex-wrap justify-center gap-8 opacity-75">
                            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300">
                                <Award className="h-5 w-5 text-[#22C55E]" />
                                <span className="text-sm font-medium">
                                    Award Winning
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300">
                                <Shield className="h-5 w-5 text-[#22C55E]" />
                                <span className="text-sm font-medium">
                                    Trusted by 100+ Organizations
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300">
                                <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 text-[#22C55E] fill-current" />
                                    <Star className="h-4 w-4 text-[#22C55E] fill-current" />
                                    <Star className="h-4 w-4 text-[#22C55E] fill-current" />
                                    <Star className="h-4 w-4 text-[#22C55E] fill-current" />
                                    <Star className="h-4 w-4 text-[#22C55E] fill-current" />
                                </div>
                                <span className="text-sm font-medium">
                                    4.9/5 Rating
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="relative py-24 z-10">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-white mb-6">
                            Protecting Forests with{" "}
                            <span className="text-[#22C55E]">Technology</span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Our advanced sound detection system helps rangers
                            and conservationists monitor forest activities in
                            real-time with unprecedented accuracy.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="group bg-white/10 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-white/20 hover:bg-white/20 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
                            <div className="bg-gradient-to-br from-[#22C55E] to-[#16A34A] p-6 rounded-2xl w-fit mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <Zap className="h-10 w-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#22C55E] transition-colors duration-300">
                                Real-time Detection
                            </h3>
                            <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-100 transition-colors duration-300">
                                Instantly detect and classify sounds like
                                chainsaws, wildlife activity, and human presence
                                with 95% accuracy using advanced AI algorithms.
                            </p>
                            <div className="flex items-center text-[#22C55E] font-semibold group-hover:text-[#34D399] transition-colors duration-300">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                <span>99.9% Uptime</span>
                            </div>
                        </div>

                        <div className="group bg-white/10 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-white/20 hover:bg-white/20 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
                            <div className="bg-gradient-to-br from-[#22C55E] to-[#16A34A] p-6 rounded-2xl w-fit mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <BarChart3 className="h-10 w-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#22C55E] transition-colors duration-300">
                                Comprehensive Analytics
                            </h3>
                            <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-100 transition-colors duration-300">
                                Generate detailed reports and visualizations to
                                track patterns, identify hotspots, and make
                                data-driven conservation decisions.
                            </p>
                            <div className="flex items-center text-[#22C55E] font-semibold group-hover:text-[#34D399] transition-colors duration-300">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                <span>Advanced AI Models</span>
                            </div>
                        </div>

                        <div className="group bg-white/10 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-white/20 hover:bg-white/20 hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 transform hover:-translate-y-3 hover:scale-105">
                            <div className="bg-gradient-to-br from-[#22C55E] to-[#16A34A] p-6 rounded-2xl w-fit mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                <Users className="h-10 w-10 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#22C55E] transition-colors duration-300">
                                Multi-user Access
                            </h3>
                            <p className="text-gray-300 leading-relaxed mb-6 group-hover:text-gray-100 transition-colors duration-300">
                                Collaborate with rangers, researchers, and
                                authorities through secure access controls and
                                real-time alert notifications.
                            </p>
                            <div className="flex items-center text-[#22C55E] font-semibold group-hover:text-[#34D399] transition-colors duration-300">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                <span>Enterprise Security</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="relative py-20 z-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center group">
                            <div className="text-5xl font-bold text-[#22C55E] mb-4">
                                24/7
                            </div>
                            <div className="text-xl font-semibold mb-2 text-white">
                                Monitoring
                            </div>
                            <div className="text-gray-400">
                                Continuous Protection
                            </div>
                        </div>
                        <div className="text-center group">
                            <div className="text-5xl font-bold text-[#22C55E] mb-4">
                                95%
                            </div>
                            <div className="text-xl font-semibold mb-2 text-white">
                                Accuracy
                            </div>
                            <div className="text-gray-400">
                                AI Detection Rate
                            </div>
                        </div>
                        <div className="text-center group">
                            <div className="text-5xl font-bold text-[#22C55E] mb-4">
                                1000+
                            </div>
                            <div className="text-xl font-semibold mb-2 text-white">
                                Sensors
                            </div>
                            <div className="text-gray-400">
                                Deployed Globally
                            </div>
                        </div>
                        <div className="text-center group">
                            <div className="text-5xl font-bold text-[#22C55E] mb-4">
                                50+
                            </div>
                            <div className="text-xl font-semibold mb-2 text-white">
                                Protected Areas
                            </div>
                            <div className="text-gray-400">Forests Secured</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="relative py-24 z-10">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            What Our Users Say
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Trusted by forest rangers, researchers, and
                            conservation organizations worldwide.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                            <Quote className="h-8 w-8 text-[#22C55E] mb-4" />
                            <p className="text-gray-300 mb-6 italic">
                                "This system has revolutionized our forest
                                monitoring. We can now detect illegal logging
                                activities within minutes."
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-[#22C55E] rounded-full flex items-center justify-center mr-4">
                                    <span className="text-white font-semibold">
                                        JD
                                    </span>
                                </div>
                                <div>
                                    <div className="font-semibold text-white">
                                        John Doe
                                    </div>
                                    <div className="text-gray-400">
                                        Forest Ranger
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                            <Quote className="h-8 w-8 text-[#22C55E] mb-4" />
                            <p className="text-gray-300 mb-6 italic">
                                "The accuracy and real-time alerts have helped
                                us save countless acres of forest land."
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-[#22C55E] rounded-full flex items-center justify-center mr-4">
                                    <span className="text-white font-semibold">
                                        JS
                                    </span>
                                </div>
                                <div>
                                    <div className="font-semibold text-white">
                                        Jane Smith
                                    </div>
                                    <div className="text-gray-400">
                                        Conservation Officer
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                            <Quote className="h-8 w-8 text-[#22C55E] mb-4" />
                            <p className="text-gray-300 mb-6 italic">
                                "The analytics dashboard provides invaluable
                                insights for our research and conservation
                                efforts."
                            </p>
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-[#22C55E] rounded-full flex items-center justify-center mr-4">
                                    <span className="text-white font-semibold">
                                        MJ
                                    </span>
                                </div>
                                <div>
                                    <div className="font-semibold text-white">
                                        Mike Johnson
                                    </div>
                                    <div className="text-gray-400">
                                        Research Scientist
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Home;
