import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Calendar, CheckCircle } from 'lucide-react';
import { PublicHeader } from '@/components/layout/PublicHeader';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to a backend
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background pt-2">
      <PublicHeader />

      {/* Main Content */}
      <section className="py-24">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Let's talk about your governance score
            </h1>
            <p className="text-lg text-muted-foreground">
              30-minute strategy call. No obligation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* What to Expect */}
            <div className="card-terminal p-8 rounded-lg">
              <h2 className="font-semibold text-lg mb-6">What to Expect</h2>
              <ul className="space-y-4">
                {[
                  'Review your free assessment results',
                  'Discuss your compliance timeline',
                  'Recommend the right scoring package',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Calendly Link */}
              <div className="mt-8 pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground mb-4">
                  Prefer to book directly?
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-border hover:border-primary/50"
                  onClick={() => window.open('https://calendar.notion.so/meet/siaai/0619', '_blank')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Open Scheduling Calendar
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card-terminal p-8 rounded-lg">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">
                    We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Work Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="bg-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="bg-background border-border resize-none"
                      placeholder="Tell us about your governance goals..."
                    />
                  </div>

                  <Button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Send Message
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">M</span>
            </div>
            <span className="text-sm text-muted-foreground">METRIS by SANJEEVANI AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            We score. You fix. Come back when ready.
          </p>
        </div>
      </footer>
    </div>
  );
}
