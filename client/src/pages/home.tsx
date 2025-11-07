import { Link } from "wouter";
import { MessageCircle, Shield, Heart, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@assets/generated_images/Woman_using_voice_assistant_peacefully_cbbd4b39.png";

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground">
                Your Trusted Companion for Safety & Wellness
              </h1>
              <p className="text-lg text-muted-foreground">
                A supportive AI friend that listens, helps you stay safe, and tracks your health journey. 
                Speak freely, stay informed, and take control of your wellbeing.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/chat">
                  <Button size="lg" className="gap-2" data-testid="button-start-chat">
                    <MessageCircle className="h-5 w-5" />
                    Start Chatting
                  </Button>
                </Link>
                <Link href="/safety">
                  <Button size="lg" variant="outline" className="gap-2" data-testid="button-view-safety">
                    <Shield className="h-5 w-5" />
                    Safety Features
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Woman using voice assistant peacefully" 
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Designed with care to support your daily life, safety, and wellness
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-elevate active-elevate-2 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl">Voice Chat</h3>
                <p className="text-muted-foreground">
                  Talk to your AI companion with voice input and get supportive responses in customizable voices
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate active-elevate-2 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="font-semibold text-xl">Safety Alerts</h3>
                <p className="text-muted-foreground">
                  Automatic detection of distress keywords and quick access to emergency contacts
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate active-elevate-2 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-chart-1/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-chart-1" />
                </div>
                <h3 className="font-semibold text-xl">Health Tracking</h3>
                <p className="text-muted-foreground">
                  Track your menstrual cycle, mood, wellness metrics, and stay on top of your health
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate active-elevate-2 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
                  <Map className="h-6 w-6 text-chart-3" />
                </div>
                <h3 className="font-semibold text-xl">Safety Map</h3>
                <p className="text-muted-foreground">
                  View interactive heat map showing safety ratings of nearby areas
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
