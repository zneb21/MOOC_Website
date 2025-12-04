import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Heart, Users, Globe, Award, Target, Eye } from "lucide-react";

const teamMembers = [
  {
    name: "Maria Santos",
    role: "Founder & Lead Instructor",
    bio: "Passionate about preserving Ilonggo heritage through education.",
  },
  {
    name: "Ramon Cruz",
    role: "Head of Content",
    bio: "Expert in traditional Filipino cuisine and cultural practices.",
  },
  {
    name: "Ana Reyes",
    role: "Community Manager",
    bio: "Dedicated to building connections among Filipino learners.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Cultural Preservation",
    description: "We believe in keeping Filipino traditions alive through education and practice.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Building strong connections between learners and local experts.",
  },
  {
    icon: Globe,
    title: "Accessible Learning",
    description: "Making quality education available to every Filipino, everywhere.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Delivering the highest quality content from expert local instructors.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-20 lg:py-28 bg-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-fade-up">
                About <span className="text-secondary">SilayLearn</span>
              </h1>
              <p className="text-primary-foreground/80 text-lg sm:text-xl leading-relaxed animate-fade-up delay-100">
                Empowering Filipino learners through localized education centered on 
                Philippine culture, Iloilo heritage, and traditional skills development.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Mission */}
              <div className="bg-card rounded-2xl p-8 lg:p-10 shadow-soft animate-fade-up">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To provide accessible, high-quality education that celebrates and preserves 
                  Filipino and Ilonggo culture. We strive to empower every learner with 
                  practical skills rooted in our rich heritage, fostering pride in our 
                  local traditions while preparing them for modern opportunities.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-card rounded-2xl p-8 lg:p-10 shadow-soft animate-fade-up delay-100">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-secondary" />
                </div>
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground mb-4">
                  Our Vision
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  To become the leading platform for localized Philippine education, 
                  creating a community where cultural knowledge is treasured, shared, 
                  and passed on to future generations. We envision a world where every 
                  Filipino can proudly share their heritage with the global community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 lg:py-28 bg-muted pattern-weave">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Our <span className="text-gradient">Values</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={value.title}
                  className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-shadow animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 lg:py-28 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Meet Our <span className="text-gradient">Team</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Passionate individuals dedicated to Filipino education
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {teamMembers.map((member, index) => (
                <div
                  key={member.name}
                  className="text-center animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-teal-light mx-auto mb-4 flex items-center justify-center">
                    <span className="font-display text-2xl font-bold text-primary-foreground">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium text-sm mb-2">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Advocacy */}
        <section className="py-20 lg:py-28 bg-primary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
                Our Advocacy
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8">
                We are committed to promoting Filipino and Ilonggo education as a means of 
                cultural preservation and economic empowerment. By teaching traditional skills 
                and knowledge, we help communities maintain their identity while creating 
                sustainable livelihoods. Every course on SilayLearn is designed to honor 
                our heritage and inspire the next generation of Filipino artisans, farmers, 
                chefs, and tourism ambassadors.
              </p>
              <div className="inline-flex items-center gap-2 text-secondary">
                <Heart className="w-5 h-5 fill-secondary" />
                <span className="font-medium">Made with love in Iloilo, Philippines</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
