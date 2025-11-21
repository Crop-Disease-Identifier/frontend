import { Link } from 'react-router-dom';
import { Leaf, Scan, MessageSquare, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { motion } from 'motion/react';
import ThemeToggle from '../components/ThemeToggle';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-green-100 dark:border-green-900 bg-white/95 dark:bg-gray-950/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="rounded-full bg-green-500 p-2">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-green-900 dark:text-green-100">CDI</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link to="/signup">Get Started</Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block rounded-full bg-green-100 dark:bg-green-900/30 px-4 py-1.5 text-sm text-green-700 dark:text-green-300"
            >
              AI-Powered Plant Health
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-green-900 dark:text-green-100"
            >
              Identify Plant Diseases Instantly
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-neutral-600 dark:text-neutral-300"
            >
              Upload a photo of your plant and get instant AI-powered diagnosis with expert treatment recommendations. Keep your crops healthy and maximize your yield.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <Link to="/signup">Get Started Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-green-200 dark:border-green-700 dark:hover:bg-green-900/20">
                <Link to="/login">Login</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1650731900879-b5f25088ff31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHBsYW50JTIwbGVhdmVzJTIwbmF0dXJlfGVufDF8fHx8MTc2MzYwOTM5MXww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Healthy plant leaves"
                className="w-full h-auto"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -bottom-6 -right-6 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl border border-green-100 dark:border-green-800 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                  <Scan className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">Diagnosis Rate</div>
                  <div className="text-green-900 dark:text-green-100">98.5% Accuracy</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white dark:bg-gray-900 py-16 md:py-24 border-t border-green-100 dark:border-green-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-green-900 dark:text-green-100 mb-4">How It Works</h2>
            <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
              Three simple steps to diagnose and treat your plant diseases
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="p-8 border-green-100 dark:border-green-800 hover:shadow-lg transition-all">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="rounded-full bg-green-100 dark:bg-green-900/30 w-16 h-16 flex items-center justify-center mb-6"
                >
                  <Scan className="h-8 w-8 text-green-600 dark:text-green-400" />
                </motion.div>
                <h3 className="text-green-900 dark:text-green-100 mb-3">1. Upload Photo</h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Take a picture of the affected plant or upload an existing image from your device.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="p-8 border-green-100 dark:border-green-800 hover:shadow-lg transition-all">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="rounded-full bg-green-100 dark:bg-green-900/30 w-16 h-16 flex items-center justify-center mb-6"
                >
                  <MessageSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
                </motion.div>
                <h3 className="text-green-900 dark:text-green-100 mb-3">2. AI Analysis</h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Our AI instantly analyzes the image and identifies potential diseases with high accuracy.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="p-8 border-green-100 dark:border-green-800 hover:shadow-lg transition-all">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="rounded-full bg-green-100 dark:bg-green-900/30 w-16 h-16 flex items-center justify-center mb-6"
                >
                  <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                </motion.div>
                <h3 className="text-green-900 dark:text-green-100 mb-3">3. Get Treatment</h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Receive detailed treatment recommendations and preventive measures to restore plant health.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-green-600 to-green-500 border-0 p-12 text-center">
              <h2 className="text-white mb-4">Ready to Protect Your Crops?</h2>
              <p className="text-green-50 mb-8 max-w-2xl mx-auto">
                Join thousands of farmers and gardeners using AI to keep their plants healthy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-green-600 hover:bg-green-50">
                  <Link to="/signup">Get Started Free</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-green-700">
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-green-100 dark:border-green-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-500 p-2">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">© 2025 CDI. All rights reserved.</span>
            </div>
            <div className="flex gap-6 text-sm text-neutral-600 dark:text-neutral-400">
              <a href="#" className="hover:text-green-600 dark:hover:text-green-400">Privacy</a>
              <a href="#" className="hover:text-green-600 dark:hover:text-green-400">Terms</a>
              <a href="#" className="hover:text-green-600 dark:hover:text-green-400">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}