
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MetaTags } from "@/components/common/MetaTags";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StaffMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
}

const staffMembers: StaffMember[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Editor in Chief",
    bio: "Sarah has been in journalism for over 15 years, previously working at the Los Angeles Times and San Bernardino Sun. She leads our editorial vision with a focus on impactful local reporting.",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Senior Reporter",
    bio: "Michael covers politics and public safety across the Inland Empire. His investigative reporting has won numerous state journalism awards.",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Gabriela Rodriguez",
    role: "Community News Editor",
    bio: "Gabriela focuses on community events, education, and local business news. She has been with IE News Hub since its founding.",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "David Wilson",
    role: "Sports Reporter",
    bio: "David covers local high school and college sports throughout San Bernardino and Riverside counties.",
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Aisha Patel",
    role: "Digital Media Manager",
    bio: "Aisha manages our website, social media presence, and digital storytelling initiatives. She brings experience from both journalism and web development.",
    image: "/placeholder.svg"
  }
];

const Staff = () => {
  return (
    <>
      <MetaTags 
        title="Our Staff | Inland Empire News Hub"
        description="Meet the dedicated team behind the Inland Empire News Hub's journalism."
      />
      <Header />
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-news-primary mb-6">Our Staff</h1>
          <p className="text-lg text-gray-700 mb-12">
            Meet the dedicated journalists and professionals who work tirelessly to bring you accurate, timely, and relevant news from across the Inland Empire.
          </p>
          
          <div className="grid gap-8 md:grid-cols-2">
            {staffMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-gray-200">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <CardDescription className="text-news-secondary font-medium">
                        {member.role}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Staff;
