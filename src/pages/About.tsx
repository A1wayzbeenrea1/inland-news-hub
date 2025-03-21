
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MetaTags } from "@/components/common/MetaTags";

const About = () => {
  return (
    <>
      <MetaTags 
        title="About Us | INLAND EMPIRE TRUENEWS"
        description="Learn more about INLAND EMPIRE TRUENEWS, our mission, values, and the team behind your trusted source for local news."
      />
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">About INLAND EMPIRE TRUENEWS</h1>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              At INLAND EMPIRE TRUENEWS, our mission is to provide accurate, timely, and relevant news coverage 
              to the communities of the Inland Empire. We believe that informed citizens make better decisions, 
              and we're committed to delivering the information you need to understand what's happening in your 
              community.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Our Values</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li><strong>Accuracy:</strong> We verify our facts and correct our mistakes promptly.</li>
              <li><strong>Independence:</strong> We report without fear or favor, serving the public interest.</li>
              <li><strong>Fairness:</strong> We present all sides of a story and avoid conflicts of interest.</li>
              <li><strong>Transparency:</strong> We are open about how and why we report stories.</li>
              <li><strong>Community Focus:</strong> We prioritize stories that matter to the Inland Empire.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Our History</h2>
            <p className="text-gray-700 mb-4">
              Founded in 2023, INLAND EMPIRE TRUENEWS emerged from a recognition that our communities needed 
              dedicated, in-depth coverage of local issues. What started as a small digital publication has 
              grown into a trusted source of news for residents throughout San Bernardino and Riverside counties.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              We welcome your feedback, news tips, and questions. Please reach out to us at:
            </p>
            <div className="bg-gray-100 p-4 rounded">
              <p className="mb-2"><strong>Email:</strong> info@inlandtruenews.com</p>
              <p className="mb-2"><strong>Phone:</strong> (909) 300-7596</p>
              <p><strong>Office:</strong> Serving the Inland Empire remotely and in-person</p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default About;
