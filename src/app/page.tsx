import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Zap, 
  Shield, 
  Globe,
  Twitter,
  Linkedin,
  Github,
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
            <Sparkles className="w-4 h-4 mr-2" />
            The Future of Link Sharing
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            All Your Links,
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              In One Place
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-white mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
            Create a stunning, personalized landing page that showcases everything you do. 
            Perfect for creators, entrepreneurs, and professionals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 hover:scale-105 font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg animate-glow transition-all duration-200 shadow-lg hover:shadow-xl">
              <Link href="/signup" className="flex items-center">
                Get Started for Free
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/20 hover:border-white/60 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg transition-all duration-200 backdrop-blur-sm">
              <Link href="#features">
                Learn More
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-white/70">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span>Growing Community</span>
            </div>
            <div className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              <span>100% Secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-4 bg-white/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose Link-Buzz?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Everything you need to create a professional online presence
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="glass border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Lightning Fast</h3>
                <p className="text-white/80">
                  Create your link page in seconds. No coding required, just add your links and go live instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Global Reach</h3>
                <p className="text-white/80">
                  Share your links worldwide with our fast, reliable infrastructure. Your audience can access your content from anywhere.
                </p>
              </CardContent>
            </Card>

            <Card className="glass border-white/20 hover:bg-white/20 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 gradient-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Secure & Private</h3>
                <p className="text-white/80">
                  Your data is protected with enterprise-grade security. We never share your information with third parties.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-16">
            Loved by Creators Worldwide
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass border-white/20">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-300 fill-current" />
                  ))}
                </div>
                <p className="text-white/90 mb-6 italic">
                  "Link-Buzz transformed how I share my content. It's so simple yet powerful. My engagement has increased by 300%!"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">SJ</span>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">Sarah Johnson</p>
                    <p className="text-white/70">Content Creator</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/20">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-300 fill-current" />
                  ))}
                </div>
                <p className="text-white/90 mb-6 italic">
                  "As an entrepreneur, Link-Buzz helps me showcase all my ventures in one place. It's professional and beautiful."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">MC</span>
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">Mike Chen</p>
                    <p className="text-white/70">Entrepreneur</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="glass border-white/20 p-12">
            <CardContent className="p-0">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Join creators who trust Link-Buzz with their online presence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-8 py-4 text-lg">
                  <Link href="/signup" className="flex items-center">
                    Start Free Today
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>

              <div className="flex flex-wrap justify-center items-center gap-6 text-white/70">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-300" />
                  <span>Setup in 2 minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-white/20">
        <div className="max-w-6xl mx-auto">
          <Separator className="mb-8 bg-white/20" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2">Link-Buzz 🐝</h3>
              <p className="text-white/70">All your links, in one place.</p>
            </div>
            
            <div className="flex space-x-6">
              <a
                href="https://x.com/wake_up_div"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="X profile"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/in/divyanshu-kanswal-738057261/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="LinkedIn profile"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/divyanshucode"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors"
                aria-label="GitHub profile"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
