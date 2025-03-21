
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MetaTags } from "@/components/common/MetaTags";

const About = () => {
  return (
    <>
      <MetaTags 
        title="About Us | IE.TrueNews"
        description="Learn more about IE.TrueNews, our mission, values, and the team behind your trusted source for local news."
      />
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Logo Banner Image */}
          <div className="w-full mb-8">
            <img 
              src="/lovable-uploads/47f04d90-3ca4-4b74-9867-fe02dc2793c2.png" 
              alt="Inland Empire TrueNews" 
              className="w-full object-contain shadow-md rounded-lg"
            />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">About IE.TrueNews</h1>
          
          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
            <p className="text-xl text-gray-700 mb-6 text-center">
              At IE.TrueNews, our mission is to provide accurate, timely, and relevant news coverage 
              to the communities of the Inland Empire. We believe that informed citizens make better decisions, 
              and we're committed to delivering the information you need to understand what's happening in your 
              community.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Values</h2>
            <ul className="list-disc pl-5 space-y-4 text-xl text-gray-700 max-w-2xl mx-auto">
              <li><strong>Accuracy:</strong> We verify our facts and correct our mistakes promptly.</li>
              <li><strong>Independence:</strong> We report without fear or favor, serving the public interest.</li>
              <li><strong>Fairness:</strong> We present all sides of a story and avoid conflicts of interest.</li>
              <li><strong>Transparency:</strong> We are open about how and why we report stories.</li>
              <li><strong>Community Focus:</strong> We prioritize stories that matter to the Inland Empire.</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6 text-center">Our History</h2>
            <p className="text-xl text-gray-700 mb-6 text-center">
              Founded in 2023, IE.TrueNews emerged from a recognition that our communities needed 
              dedicated, in-depth coverage of local issues. What started as a small digital publication has 
              grown into a trusted source of news for residents throughout San Bernardino and Riverside counties.
            </p>
          </section>
          
          <section>
            <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
            <p className="text-xl text-gray-700 mb-6 text-center">
              We welcome your feedback, news tips, and questions. Please reach out to us at:
            </p>
            <div className="bg-gray-100 p-6 rounded-lg shadow-md max-w-2xl mx-auto">
              <p className="mb-3 text-xl"><strong>Email:</strong> ie.truenews@gmail.com</p>
              <p className="mb-3 text-xl"><strong>Phone:</strong> (909) 300-7596</p>
              <p className="text-xl"><strong>Office:</strong> Serving the Inland Empire remotely and in-person</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default About;
