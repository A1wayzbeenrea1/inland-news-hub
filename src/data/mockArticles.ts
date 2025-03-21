import { Article } from "@/types/article";

// Original mock articles
export const articles: Article[] = [
  {
    id: '1',
    title: 'State order aids Redlands firefighters battling wildfires',
    excerpt: 'Days after the new year began, several Los Angeles counties erupted into flames. Three volatile wildfires — Palisades, Eaton and Hurst — captured national attention.',
    content: `<p>Days after the new year began, several Los Angeles counties erupted into flames. Three volatile wildfires — Palisades, Eaton and Hurst — captured national attention. The unprecedented crises required assistance from surrounding first responders.</p>
    <p>More than 15,000 personnel, including firefighters from Redlands, were deployed to help contain the blazes which have consumed over 100,000 acres so far. State officials have declared a state of emergency.</p>
    <p>"Our team is proud to support our neighboring communities in their time of need," said Redlands Fire Chief John Smith. "We train for these scenarios year-round, and our firefighters are among the best-prepared in the region."</p>
    <p>The Redlands Fire Department has sent three engine companies and 15 personnel to assist with the containment efforts. They are expected to remain deployed for at least two weeks.</p>
    <p>Governor Gavin Newsom toured the affected areas on Tuesday and announced additional funding for wildfire prevention and response. "The bravery of these men and women on the frontlines is extraordinary," he said during a press conference.</p>
    <p>Local officials urge Inland Empire residents to remain vigilant about fire safety, especially as dry conditions persist throughout Southern California.</p>`,
    image: '/lovable-uploads/0b362b4a-4021-433f-a6ae-b2d6b9238105.png',
    category: 'Public Safety',
    author: 'Israel J. Cerreno Jr.',
    publishedAt: '2023-07-10T08:00:00Z',
    slug: 'state-order-aids-redlands-firefighters',
    featured: true
  },
  {
    id: '2',
    title: 'Armed suspect threat triggers Loma Linda lockdown',
    excerpt: 'The San Bernardino County Sheriff\'s Department (SBCSD) responded to a possible armed subject at the Loma Linda University Children\'s Hospital on the evening of March 12.',
    content: `<p>The San Bernardino County Sheriff's Department (SBCSD) responded to a possible armed subject at the Loma Linda University Children's Hospital on the evening of March 12. Over 200 law enforcement arrived at the hospital to secure the medical facility.</p>
    <p>According to Sheriff's spokesperson Deputy Sarah Johnson, the department received a call at approximately 8:45 PM reporting an individual with what appeared to be a firearm entering the hospital's east entrance.</p>
    <p>"Within minutes, we had units on scene establishing a perimeter and beginning evacuation procedures for non-essential personnel," Johnson said.</p>
    <p>The hospital was placed on immediate lockdown, with patients and staff sheltering in place in secure areas. SWAT teams conducted a systematic search of the 11-story facility.</p>
    <p>After a three-hour operation, authorities determined the report was unfounded. Investigators believe the individual spotted may have been carrying a medical device that was mistaken for a weapon in the dimly lit parking area.</p>
    <p>Hospital operations returned to normal by 1 AM, though security measures remained heightened through the following day. Loma Linda University Health issued a statement thanking law enforcement for their rapid response and commending staff for following emergency protocols.</p>`,
    image: 'https://images.unsplash.com/photo-1612821745127-bd9658171f5e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'Public Safety',
    author: 'Michael Rodriguez',
    publishedAt: '2023-07-09T14:30:00Z',
    slug: 'armed-suspect-threat-triggers-loma-linda-lockdown'
  },
  {
    id: '3',
    title: 'Yucaipa High School robotics team advances to national championship',
    excerpt: 'The Yucaipa High School robotics team, the "ThunderBots," has qualified for the FIRST Robotics Competition National Championship after their impressive performance at the Southern California Regional.',
    content: `<p>The Yucaipa High School robotics team, the "ThunderBots," has qualified for the FIRST Robotics Competition National Championship after their impressive performance at the Southern California Regional competition held in Long Beach last weekend.</p>
    <p>The team of 15 students, led by faculty advisor and engineering teacher Dr. Elena Vazquez, competed against 42 other high schools from across the region. Their robot, dubbed "Thunderstrike," demonstrated exceptional performance in challenges requiring precise movement, object manipulation, and autonomous operation.</p>
    <p>"I couldn't be prouder of what these students have accomplished," said Dr. Vazquez. "They've put in countless hours after school and on weekends over the past six months to design, build, and program their robot."</p>
    <p>Team captain and senior Aiden Parks attributed their success to innovative design choices and a collaborative team dynamic. "We approached the competition differently this year by focusing on reliability and consistency rather than trying to do everything," Parks explained.</p>
    <p>The national championship will be held in Houston, Texas next month, where the ThunderBots will compete against more than 400 teams from around the world. The team is currently fundraising to cover travel expenses, with several local technology companies already stepping forward as sponsors.</p>
    <p>This marks the first time a Yucaipa High School team has advanced to the national level in the competition's history.</p>`,
    image: 'https://images.unsplash.com/photo-1589254065909-b7086229d08c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'Education',
    author: 'Jennifer Chen',
    publishedAt: '2023-07-08T09:15:00Z',
    slug: 'yucaipa-high-school-robotics-team-advances-to-national-championship',
    featured: true
  },
  {
    id: '4',
    title: 'Ontario International Airport reports record passenger growth',
    excerpt: 'Ontario International Airport (ONT) has reported a 12.8% increase in passenger traffic for the second quarter of 2023 compared to the same period last year, marking the airport\'s strongest growth since before the pandemic.',
    content: `<p>Ontario International Airport (ONT) has reported a 12.8% increase in passenger traffic for the second quarter of 2023 compared to the same period last year, marking the airport's strongest growth since before the pandemic.</p>
    <p>According to figures released yesterday by the Ontario International Airport Authority (OIAA), more than 1.6 million travelers passed through the airport between April and June, surpassing pre-pandemic levels for the first time.</p>
    <p>"These numbers reflect the Inland Empire's strong economic recovery and ONT's increasing appeal as an alternative to other Southern California airports," said Alan Wapner, President of the OIAA Board of Commissioners.</p>
    <p>The growth has been fueled by several new routes and increased service from major carriers. In the past year, ONT has added direct flights to Chicago, Dallas, and New York, as well as international service to Mexico City.</p>
    <p>The airport also reported a 5.3% increase in cargo volume, handling more than 198,000 tons of freight during the same period, underlining its importance as a logistics hub for the region.</p>
    <p>To accommodate the growing traffic, ONT has announced plans for a $20 million terminal improvement project set to begin next month, which will include expanded security checkpoints, additional dining options, and modernized passenger amenities.</p>`,
    image: 'https://images.unsplash.com/photo-1588412079626-704311e1fa45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'Business',
    author: 'David Washington',
    publishedAt: '2023-07-07T11:20:00Z',
    slug: 'ontario-international-airport-reports-record-passenger-growth'
  },
  {
    id: '5',
    title: 'Redlands City Council approves downtown development plan',
    excerpt: 'After months of public hearings and community input, the Redlands City Council has approved an ambitious redevelopment plan for the city\'s historic downtown district.',
    content: `<p>After months of public hearings and community input, the Redlands City Council has approved an ambitious redevelopment plan for the city's historic downtown district. The 4-1 vote came after a marathon six-hour meeting that included testimony from dozens of residents and business owners.</p>
    <p>The "Redlands Downtown 2030" plan includes provisions for mixed-use development, pedestrian-friendly streetscapes, and the preservation of historic buildings. The plan also addresses parking concerns with a proposed three-story parking structure on Citrus Avenue.</p>
    <p>"This represents a balanced approach to growth that respects our city's character while positioning us for the future," said Mayor Sarah Martinez, who voted in favor of the plan.</p>
    <p>The lone dissenting vote came from Councilmember James Wilson, who expressed concerns about the height allowances for new buildings, which could reach up to five stories in certain areas.</p>
    <p>"While I support revitalization, I believe we need stricter limits to preserve the small-town feel that makes Redlands special," Wilson said.</p>
    <p>The plan's approval comes as downtown Redlands has seen increased vacancy rates in recent years, a trend city officials hope to reverse with the new development guidelines.</p>
    <p>Implementation will begin immediately, with the first phase focusing on infrastructure improvements and streamlining the permit process for new businesses looking to establish a presence in the downtown area.</p>`,
    image: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'Politics',
    author: 'Rachel Kim',
    publishedAt: '2023-07-06T16:45:00Z',
    slug: 'redlands-city-council-approves-downtown-development-plan',
    featured: true
  },
  {
    id: '6',
    title: 'Rialto school district announces new STEM program partnership',
    excerpt: 'The Rialto Unified School District has entered into a partnership with several technology companies to enhance STEM education opportunities for students across all grade levels.',
    content: `<p>The Rialto Unified School District has entered into a partnership with several technology companies to enhance STEM education opportunities for students across all grade levels. The initiative, announced at Tuesday's school board meeting, represents a $3.5 million investment in science, technology, engineering, and mathematics education.</p>
    <p>Amazon, Google, and local tech firm Esri have committed resources, including equipment, curriculum materials, and professional development for teachers. The program will be phased in over the next three years, beginning with middle schools this fall.</p>
    <p>"This partnership will transform how our students learn critical STEM skills and prepare them for the jobs of tomorrow," said Superintendent Dr. Marcus Williams. "We're particularly excited about increasing access to advanced technology for our underserved student populations."</p>
    <p>A key component of the program includes a mentorship initiative that will connect students with professionals in STEM fields. Additionally, summer internship opportunities will be available for high school students.</p>
    <p>The district will also establish "innovation labs" at each middle and high school, equipped with 3D printers, robotics kits, and coding stations.</p>
    <p>"As a company headquartered in the Inland Empire, we're committed to developing local talent," said Maria Gonzalez, regional director at Esri. "These students represent the future workforce of our region."</p>
    <p>Parents and students can learn more about the program at information sessions scheduled throughout August before the new school year begins.</p>`,
    image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'Education',
    author: 'Thomas Johnson',
    publishedAt: '2023-07-05T13:10:00Z',
    slug: 'rialto-school-district-announces-new-stem-program-partnership'
  },
  {
    id: '7',
    title: 'Local vineyard wins prestigious international wine competition',
    excerpt: 'Oak Mountain Winery in Yucaipa has put the Inland Empire on the global wine map after winning a gold medal at the International Wine Competition in Bordeaux, France.',
    content: `<p>Oak Mountain Winery in Yucaipa has put the Inland Empire on the global wine map after winning a gold medal at the International Wine Competition in Bordeaux, France. The family-owned winery received the honor for its 2021 Estate Syrah, competing against more than 7,000 entries from 45 countries.</p>
    <p>"We're absolutely thrilled and honestly a bit shocked," said Maria Garcia, who co-owns the winery with her husband Carlos. "To be recognized in Bordeaux, the heart of the wine world, is beyond our wildest dreams."</p>
    <p>The Garcias established their vineyard in 2011 on a former apple orchard in the foothills of Yucaipa, an area not traditionally known for winemaking. Despite skepticism from industry experts about the region's potential for quality wine production, the couple persisted in their vision.</p>
    <p>"We always believed our microclimate here in the foothills had something special to offer," Carlos explained. "The elevation, the soil composition, and the temperature variations between day and night create ideal conditions for certain varietals, particularly Syrah."</p>
    <p>The award-winning wine was produced from grapes grown exclusively on their 15-acre estate and aged for 18 months in French oak barrels. Only 500 cases were produced.</p>
    <p>Since the announcement, the winery has seen a surge in visitors and their online inventory of the 2021 Syrah has completely sold out. They're now allocating their remaining stock for tasting room visitors only.</p>
    <p>Local tourism officials are hopeful that the recognition will boost wine tourism throughout the region, which now boasts more than a dozen small wineries.</p>`,
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'Business',
    author: 'Sophia Martinez',
    publishedAt: '2023-07-04T10:00:00Z',
    slug: 'local-vineyard-wins-prestigious-international-wine-competition'
  },
  {
    id: '8',
    title: 'Police arrest 11 in retail theft operation at Mountain Grove and Citrus Plaza',
    excerpt: 'Members of the Redlands Police Department\'s Community Engagement Team conducted a Retail Theft Operation on Jan. 30 at the Mountain Grove and Citrus Plaza shopping centers.',
    content: `<p>Members of the Redlands Police Department's Community Engagement Team conducted a Retail Theft Operation on Jan. 30 at the Mountain Grove and Citrus Plaza shopping centers, resulting in the arrest of 11 individuals and the recovery of $7,600 worth of stolen merchandise.</p>
    <p>The operation, conducted in collaboration with loss prevention teams from major retailers including Target, Kohl's, and JCPenney, was planned in response to increasing reports of organized retail theft in the area.</p>
    <p>"Retail theft isn't a victimless crime – it affects everyone through higher prices and reduced tax revenue for essential services," said Redlands Police Chief Robert Jenkins. "These operations are designed to send a message that such activity won't be tolerated in our community."</p>
    <p>Among those arrested was Bradley Thompson, 34, who is suspected of being involved in a retail theft ring operating throughout the Inland Empire. Thompson had multiple outstanding warrants and was found with stolen items from several stores valued at over $2,000.</p>
    <p>The operation also resulted in the recovery of two stolen vehicles and the seizure of various tools commonly used in retail theft, including foil-lined bags designed to defeat security sensors.</p>
    <p>Most of the individuals arrested were charged with shoplifting and commercial burglary, with some facing additional charges related to outstanding warrants.</p>
    <p>Redlands police plan to conduct similar operations in the future and are working with neighboring jurisdictions to address the regional nature of organized retail theft.</p>`,
    image: 'https://images.unsplash.com/photo-1619279302118-43033660826a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'Public Safety',
    author: 'Kyle Bennett',
    publishedAt: '2023-07-03T15:20:00Z',
    slug: 'police-arrest-11-in-retail-theft-operation'
  },
  {
    id: '9',
    title: 'Redlands Fire Department assist with LA fires',
    excerpt: 'As flames roared across the Los Angeles hills, painting the night sky a vivid orange, Redlands Fire Department Captain Brent Fuller stood shoulder to shoulder with his crew.',
    content: `<p>As flames roared across the Los Angeles hills, painting the night sky a vivid orange, Redlands Fire Department Captain Brent Fuller stood shoulder to shoulder with his crew, defying walls of heat and unpredictable winds. It's hard to put into words the scale of the wildfire they've been battling for the past 72 hours.</p>
    <p>"In my 22 years as a firefighter, I've never seen fire behavior like this so early in the season," Fuller said during a brief break at the command post established near the Palisades fire front.</p>
    <p>Fuller leads one of three engine companies from Redlands that have been deployed as part of the state's mutual aid system. His team was dispatched immediately after the governor declared a state of emergency.</p>
    <p>The Redlands crews have been primarily assigned to structure protection in threatened neighborhoods and establishing containment lines along the eastern flank of the fire. Working 24-hour shifts with 12 hours of rest in between, the firefighters have endured physical exhaustion and dangerous conditions.</p>
    <p>"What makes these fires particularly challenging is how quickly they're moving through both rugged terrain and into the wildland-urban interface," explained Fuller. "The drought conditions have created exceptionally dry fuel, and the winds have been erratic."</p>
    <p>Despite the challenges, the Redlands firefighters have been credited with saving at least 15 homes in the path of the blaze. Battalion Chief Sandra Miller, who oversees the Redlands deployment, emphasized the importance of the mutual aid system.</p>
    <p>"Today we're helping Los Angeles, tomorrow they could be helping us," Miller said. "That's how California's fire service works—we're all one team when it matters most."</p>
    <p>The Redlands crews are expected to remain deployed for at least another week as containment efforts continue.</p>`,
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'Public Safety',
    author: 'Emily Walker',
    publishedAt: '2023-07-02T09:40:00Z',
    slug: 'redlands-fire-department-assist-with-la-fires'
  },
  {
    id: '10',
    title: 'New affordable housing development breaks ground in Ontario',
    excerpt: 'Construction has begun on Parkview Commons, a 120-unit affordable housing development in south Ontario that aims to address the growing housing crisis in the Inland Empire.',
    content: `<p>Construction has begun on Parkview Commons, a 120-unit affordable housing development in south Ontario that aims to address the growing housing crisis in the Inland Empire. The $42 million project, located near Ontario International Airport, represents one of the largest affordable housing investments in the city in over a decade.</p>
    <p>"This development marks a significant step forward in our commitment to ensuring that Ontario remains accessible to working families," said Mayor Robert Garcia during Tuesday's groundbreaking ceremony.</p>
    <p>The project is a public-private partnership between the City of Ontario, San Bernardino County, and developer Community Housing Partners. It will offer one, two, and three-bedroom apartments for households earning between 30% and 60% of the area median income.</p>
    <p>Monthly rents will range from approximately $550 to $1,200, well below market rates in the region, which have increased by more than 35% since 2019.</p>
    <p>Beyond affordable rents, the complex will feature amenities including a community center, childcare facility, computer lab, and playground. The development will also incorporate sustainable features such as solar panels, energy-efficient appliances, and drought-resistant landscaping.</p>
    <p>"We're not just building housing; we're building a community," explained Jessica Torres, executive director of Community Housing Partners. "The support services integrated into this development will help residents thrive."</p>
    <p>Construction is expected to take 18 months, with the first residents moving in by early 25. A waiting list for applications will open six months before completion.</p>
    <p>The project is partially funded through state housing bonds, federal tax credits, and $5 million from the city's affordable housing fund.</p>`,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'Politics',
    author: 'Marcus Johnson',
    publishedAt: '2023-07-01T12:15:00Z',
    slug: 'new-affordable-housing-development-breaks-ground-in-ontario'
  }
];
