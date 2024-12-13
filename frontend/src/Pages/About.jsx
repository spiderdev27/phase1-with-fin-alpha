import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Target, Shield, Cpu, Users, Brain } from 'lucide-react';

const About = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('free');
  const navigate = useNavigate();

  useEffect(() => {
    // Check for logged in user
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setCurrentPlan(user.subscriptionType || 'free');
    }
  }, []);

  const features = [
    {
      icon: <Brain className="w-12 h-12 mb-4 text-[rgb(88,28,135)]" />,
      title: "AI-Powered Analysis",
      description: "Cutting-edge artificial intelligence algorithms provide deep insights into financial markets and investment opportunities."
    },
    {
      icon: <Target className="w-12 h-12 mb-4 text-[rgb(88,28,135)]" />,
      title: "Precision Trading",
      description: "Advanced technical analysis tools help you make informed trading decisions with greater accuracy."
    },
    {
      icon: <Shield className="w-12 h-12 mb-4 text-[rgb(88,28,135)]" />,
      title: "Secure Platform",
      description: "Bank-grade security measures protect your data and transactions with the highest level of encryption."
    },
    {
      icon: <Cpu className="w-12 h-12 mb-4 text-[rgb(88,28,135)]" />,
      title: "Real-time Processing",
      description: "Lightning-fast data processing ensures you never miss a market opportunity."
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "Support" },
    { number: "50+", label: "AI Models" }
  ];

  const team = [
    {
      name: "Mohit Anand",
      role: "CEO & Founder",
      description: "Visionary leader with expertise in AI and financial technology, driving innovation in algorithmic trading.",
      image: "/images/mohit-anand.jpg"
    },
    {
      name: "Aditi Panwar",
      role: "CFO & Co-founder",
      description: "Financial strategist with deep expertise in risk management and corporate finance.",
      image: "/images/aditi-panwar.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative min-h-screen pt-48 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Purple Glow Effect */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10">
              <div className="w-[600px] h-[600px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl rounded-full opacity-30"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 space-y-24">
              {/* Title Section */}
              <div className="text-center mt-20">
                <h1 className="text-7xl font-bold mb-10 animate-fade-in-down">
                  <span className="text-purple-900 dark:text-white">About </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">Fin.AI</span>
                </h1>
                <p className="text-2xl max-w-3xl mx-auto text-purple-800/80 dark:text-gray-300 leading-relaxed">
                  Empowering investors with artificial intelligence to make smarter financial decisions. Our platform combines cutting-edge technology with financial expertise.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-20">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="relative group"
                  >
                    {/* Card Background with Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-500/5 rounded-2xl transform transition-all duration-300 group-hover:scale-105"></div>
                    
                    {/* Card Content */}
                    <div className="relative bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center transform transition-all duration-300 border border-purple-100/50 dark:border-purple-800/20 group-hover:translate-y-[-5px] group-hover:shadow-xl">
                      <h3 className="text-5xl font-bold text-purple-900 dark:text-white mb-3">{stat.number}</h3>
                      <p className="text-lg font-medium text-purple-800/80 dark:text-gray-300">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto py-20 px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-purple-900 dark:text-white">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100/50 dark:border-purple-800/20">
              {feature.icon}
              <h3 className="text-xl font-bold mb-4 text-purple-900 dark:text-white">{feature.title}</h3>
              <p className="text-purple-800/80 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto py-20 px-4">
        <div className="bg-white/70 dark:bg-white/10 backdrop-blur-sm rounded-lg p-12 shadow-lg border border-purple-100/50 dark:border-purple-800/20">
          <h2 className="text-4xl font-bold text-center mb-8 text-purple-900 dark:text-white">Our Mission</h2>
          <p className="text-xl text-purple-800/80 dark:text-gray-300 text-center max-w-4xl mx-auto">
            At Fin.AI, we're committed to democratizing financial intelligence through innovative technology. 
            Our mission is to provide every investor, from beginners to professionals, with the tools and insights 
            they need to succeed in the financial markets.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-white/30 dark:bg-white/10 backdrop-blur-sm rounded-full">
            <span className="text-purple-900 dark:text-purple-300 font-semibold">
              <Users className="inline-block w-5 h-5 mr-2" />
              Our Leadership
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-6 text-purple-900 dark:text-white">
            Meet Our Team
          </h2>
          <p className="text-xl text-purple-800/80 dark:text-gray-300 max-w-2xl mx-auto">
            Driven by innovation and excellence, our leadership team brings together expertise in AI, finance, and technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-3xl backdrop-blur-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 p-8">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=8B5CF6&color=fff`;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-white mb-2">{member.name}</h3>
                    <p className="text-purple-300 font-medium mb-3">{member.role}</p>
                    <p className="text-gray-300 leading-relaxed">{member.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About; 