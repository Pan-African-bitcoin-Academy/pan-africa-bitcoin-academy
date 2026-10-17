import { StructuredData } from "@/components/StructuredData";
import { HomePageClient } from "@/components/HomePageClient";
import { supabaseAdmin } from "@/lib/supabase";
import { chaptersContent } from "@/content/chaptersContent";
import { getChapterListByTitle } from "@/content/chaptersListContent";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Learn Bitcoin - First Eritrea Based Bitcoin Academy",
  description: "PanAfrican Bitcoin Academy (ፓናፍሪካን ቢትኮይን ኣካዳሚ) - first Eritrea based Bitcoin academy in Asmara. Learn Bitcoin education in Eritrea, Uganda, and across Africa. Convert Bitcoin to Nakfa, join Eritrean Bitcoiners and the ኤርትራ ቢትኮይን community. Clear lessons, real security, and developer pathways.",
  keywords: [
    "Bitcoin education Africa",
    "Learn Bitcoin",
    "Bitcoin academy",
    "Bitcoin tutorials for beginners",
    "PanAfrican Bitcoin Academy",
    "ፓናፍሪካን ቢትኮይን ኣካዳሚ",
    "ኤርትራ ቢትኮይን",
    "Eritrea Bitcoin academy",
    "Eritrea Bitcoin",
    "Eritrean Bitcoiners",
    "first Eritrean Bitcoin education",
    "Asmara Bitcoin education",
    "Bitcoin education Asmara",
    "Bitcoin Nakfa",
    "convert Bitcoin to Nakfa",
    "Habesha Bitcoin",
    "BTC to Nakfa",
    "Bitcoin to nakfa",
    "Bitcoin in Eritrea",
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Learn Bitcoin - First Eritrea Based Bitcoin Academy",
    description: "PanAfrican Bitcoin Academy (ፓናፍሪካን ቢትኮይን ኣካዳሚ) - first Eritrea based Bitcoin academy in Asmara. Learn Bitcoin education, convert Bitcoin to Nakfa, and join Eritrean Bitcoiners and the ኤርትራ ቢትኮይን community. Clear lessons, real security, and developer pathways.",
  },
};

// Mentor type definition
type Mentor = {
  name: string;
  role: string;
  description: string;
  image: string | null;
  github: string | null;
  twitter: string | null;
  type: string | null;
};

// Fallback mentors (for initial display or if database fetch fails)
const fallbackMentors: Mentor[] = [
  {
    name: "Yohannes Amanuel",
    role: "Bitcoin Educator & Development Mentor",
    description: "Educates students on Bitcoin fundamentals and mentors Bitcoin development.",
    image: "/images/mentors/yohannes-amanuel.jpg",
    github: "https://github.com/Joie199",
    twitter: "https://twitter.com/joieama",
    type: null,
  },
  {
    name: "Semir Omer",
    role: "Bitcoin Core Mentor & Developer",
    description: "Mentors students in Bitcoin Core development and contributes to the Bitcoin protocol.",
    image: "/images/mentors/semir-omer.jpg",
    github: "https://github.com/samiromer2",
    twitter: "https://twitter.com/samiromer",
    type: null,
  },
  {
    name: "Ojok Emmanuel Nsubuga",
    role: "Software Developer",
    description: "Software developer contributing to Bitcoin wallet development and open-source projects.",
    image: "/images/mentors/ojokne.jpg",
    github: "https://github.com/ojokne",
    twitter: "https://x.com/Ojokne",
    type: null,
  },
];

async function getMentors(): Promise<Mentor[]> {
  try {
    const { data: mentors, error } = await supabaseAdmin
      .from('mentors')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      // Only log meaningful errors (not empty objects)
      const errorInfo = {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      };
      // Only log if there's actual error information
      if (errorInfo.message || errorInfo.code) {
        console.error('Error fetching mentors:', errorInfo);
      }
      return fallbackMentors;
    }

    // Transform database mentors to match the expected format
    const transformedMentors: Mentor[] = (mentors || []).map((mentor) => ({
      name: mentor.name,
      role: mentor.role,
      description: mentor.description || '',
      image: mentor.image_url || null,
      github: mentor.github || null,
      twitter: mentor.twitter || null,
      type: mentor.type || null,
    }));

    // Merge with fallback mentors (for Yohannes and Semir who might not be in DB yet)
    // Only add fallback if they're not already in the list
    const mentorNames = new Set(transformedMentors.map(m => m.name.toLowerCase()));
    const additionalMentors = fallbackMentors.filter(m => !mentorNames.has(m.name.toLowerCase()));
    
    return [...transformedMentors, ...additionalMentors];
  } catch (error) {
    console.error('Error fetching mentors:', error instanceof Error ? error.message : String(error));
    return fallbackMentors;
  }
}

interface ImpactStats {
  studentsTrained: number;
  satsRewarded: number;
  countriesRepresented: number;
}

async function getImpactStats(): Promise<ImpactStats> {
  try {
    // Fetch total students (all enrolled students, not just graduated)
    const { count: totalStudents, error: studentsError } = await supabaseAdmin
      .from('students')
      .select('*', { count: 'exact', head: true });

    if (studentsError) {
      // Only log meaningful errors (not empty objects)
      const errorInfo = {
        message: studentsError.message,
        details: studentsError.details,
        hint: studentsError.hint,
        code: studentsError.code,
      };
      // Only log if there's actual error information
      if (errorInfo.message || errorInfo.code) {
        console.error('Error fetching students:', errorInfo);
      }
    }

    // Fetch distinct countries from students
    const { data: studentsData, error: countriesError } = await supabaseAdmin
      .from('students')
      .select('country');

    if (countriesError) {
      console.error('Error fetching student countries:', {
        message: countriesError.message,
        details: countriesError.details,
        hint: countriesError.hint,
        code: countriesError.code,
      });
    }

    let countriesReached = 0;
    if (!countriesError && studentsData) {
      const distinctCountries = new Set(
        studentsData
          .map((s) => s.country)
          .filter((c) => c && c.trim() !== '')
      );
      countriesReached = distinctCountries.size;
    }

    // Fetch sats rewards
    const { data: rewards, error: satsError } = await supabaseAdmin
      .from('sats_rewards')
      .select('amount_paid, amount_pending');

    if (satsError) {
      console.error('Error fetching sats rewards:', {
        message: satsError.message,
        details: satsError.details,
        hint: satsError.hint,
        code: satsError.code,
      });
    }

    let satsRewarded = 0;
    if (!satsError && rewards) {
      rewards.forEach((reward: any) => {
        const paid = reward.amount_paid || 0;
        const pending = reward.amount_pending || 0;
        satsRewarded += paid + pending; // Total sats awarded
      });
    }

    return {
      studentsTrained: totalStudents || 0,
      satsRewarded: satsRewarded || 0,
      countriesRepresented: countriesReached || 0,
    };
  } catch (error) {
    console.error('Error fetching impact stats:', error instanceof Error ? error.message : String(error));
    // Return fallback values
    return {
      studentsTrained: 0,
      satsRewarded: 0,
      countriesRepresented: 0,
    };
  }
}

interface UpcomingEvent {
  id: string;
  title: string;
  type: string;
  date: Date;
  dateString: string;
  time: string;
  description: string;
  link: string | null;
  image_url: string | null;
  image_alt_text: string | null;
  is_registration_enabled?: boolean;
  cohort_id?: string | null;
  /** When this event is a cohort session with a topic linked to a chapter (saved in DB as topic) */
  chapter_slug?: string | null;
  chapter_title?: string | null;
  /** Short line about what the topic is about (from chapter hook) */
  topic_detail?: string | null;
  /** What you'll learn (from chapter, first few points) */
  topic_learn?: string[] | null;
  /** Chapter list layout: theory / practice / live session / quiz (from chapters list) */
  topic_theory?: string[] | null;
  topic_practice?: string[] | null;
  topic_live_session?: string | null;
  topic_quiz?: string | null;
}

async function getUpcomingEvents(): Promise<UpcomingEvent[]> {
  try {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();
    // Use a 12-hour buffer so events that are "today" in timezones ahead of UTC still get fetched
    const cutoff = new Date(today.getTime() - 12 * 60 * 60 * 1000);
    const cutoffISO = cutoff.toISOString();

    // Fetch all events (for everyone - cohort_id is null) and upcoming cohort sessions
    // Important: Only events with cohort_id = null ("For Everyone" in admin) appear here.
    const [eventsResult, sessionsResult] = await Promise.all([
      supabaseAdmin
        .from('events')
        .select('*')
        .is('cohort_id', null)
        .gte('start_time', cutoffISO)
        .order('start_time', { ascending: true })
        .limit(100),
      // Fetch upcoming cohort sessions
      supabaseAdmin
        .from('cohort_sessions')
        .select('*, cohorts(name)')
        .gte('session_date', today.toISOString().split('T')[0])
        .order('session_date', { ascending: true })
        .limit(10),
    ]);

    const upcomingEvents: UpcomingEvent[] = [];

    // Transform events (only include those that haven't started yet)
    if (eventsResult.data) {
      eventsResult.data.forEach((event: any) => {
        const startTime = event.start_time ? new Date(event.start_time) : new Date();
        if (startTime < now) return; // skip past events
        upcomingEvents.push({
          id: event.id,
          title: event.name || 'Untitled Event',
          type: event.type || 'community',
          date: startTime,
          dateString: startTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
          description: event.description || '',
          link: event.link || null,
          image_url: event.image_url || null,
          image_alt_text: event.image_alt_text || null,
          is_registration_enabled: event.is_registration_enabled || false,
          cohort_id: event.cohort_id || null,
        });
      });
    }

    // Transform sessions (topic is stored in DB; match to chapter for link)
    const chapterByTitle = new Map(chaptersContent.map((c) => [c.title, c]));
    if (sessionsResult.data) {
      sessionsResult.data.forEach((session: any) => {
        const sessionDate = new Date(session.session_date);
        const cohortName = session.cohorts?.name || 'Cohort';
        const topic = session.topic || '';
        const chapter = topic ? chapterByTitle.get(topic) ?? null : null;
        const chapterList = topic ? getChapterListByTitle(topic) : null;
        upcomingEvents.push({
          id: `session-${session.id}`,
          title: `${cohortName} - Session ${session.session_number}${topic ? `: ${topic}` : ''}`,
          type: 'live-class',
          date: sessionDate,
          dateString: sessionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: session.duration_minutes ? `${session.duration_minutes} min` : '60 min',
          description: topic || `Cohort session ${session.session_number}`,
          link: session.link || null,
          image_url: null,
          image_alt_text: null,
          chapter_slug: chapter?.slug ?? null,
          chapter_title: chapter?.title ?? null,
          topic_detail: chapter?.hook ?? null,
          topic_learn: chapter?.learn?.slice(0, 5) ?? null,
          topic_theory: chapterList?.theory ?? null,
          topic_practice: chapterList?.practice ?? null,
          topic_live_session: chapterList?.LiveSession ?? null,
          topic_quiz: chapterList?.quiz ?? null,
        });
      });
    }

    // Sort by date and return top 12 (to show more events from admin)
    const sortedEvents = upcomingEvents
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 12);

    // Log for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Homepage] Upcoming Events:', {
        totalFetched: upcomingEvents.length,
        totalDisplayed: sortedEvents.length,
        eventsFromDB: eventsResult.data?.length || 0,
        sessionsFromDB: sessionsResult.data?.length || 0,
        todayISO: today.toISOString(),
      });
    }

    return sortedEvents;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}

interface Testimonial {
  id: string;
  name: string;
  city: string;
  quote: string;
  rating: number;
  photo: string | null;
}

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const { data: testimonials, error: testimonialsError } = await supabaseAdmin
      .from('student_testimonials')
      .select('id, testimonial, rating, display_order, is_featured, created_at, student_id')
      .eq('is_approved', true)
      .order('is_featured', { ascending: false })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(6);

    if (testimonialsError || !testimonials || testimonials.length === 0) {
      return [];
    }

    const studentIds = testimonials.map((t: any) => t.student_id);
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id, name, city, country, photo_url')
      .in('id', studentIds);

    const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));

    return testimonials.map((t: any) => {
      const profile: any = profileMap.get(t.student_id) || {};
      let location = '';
      if (profile.city && profile.country) location = `${profile.city}, ${profile.country}`;
      else if (profile.country) location = profile.country;
      else if (profile.city) location = profile.city;

      return {
        id: t.id,
        name: profile.name || 'Student',
        city: location,
        quote: t.testimonial,
        rating: t.rating || 5,
        photo: profile.photo_url || null,
      };
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error instanceof Error ? error.message : String(error));
    return [];
  }
}

const homeStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Pan-African Bitcoin Academy',
  description: 'Learn Bitcoin the right way with clear, technical guidance. Comprehensive Bitcoin education, developer resources, and community support across Africa.',
  url: 'https://panafricanbitcoin.com',
  logo: 'https://panafricanbitcoin.com/images/logo_3.png',
  sameAs: [
    'https://github.com/Joie199/pan-africa-bitcoin-academy',
    'https://chat.whatsapp.com/KpjlC90BGIj1EChMHsW6Ji',
    'https://jumble.social/users/npub1q659nzy6j3mn8nr8ljznzumplesd40276tefj6gjz72npmqqg5cqmh70vv',
    'https://discord.gg/4G4TUAP7',
    'https://www.facebook.com/profile.php?id=61586743276906',
    'https://x.com/panafricanbtc',
    'https://www.instagram.com/panafricanbitcoin/',
    'https://www.tiktok.com/@panafricanbitcoin',
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'UG',
  },
  offers: {
    '@type': 'Offer',
    category: 'Education',
    description: 'Bitcoin education courses and developer training',
  },
};

export default async function Home() {
  const mentors = await getMentors();
  const impactStats = await getImpactStats();
  const upcomingEvents = await getUpcomingEvents();
  const testimonials = await getTestimonials();

  const formattedUpcomingEvents = upcomingEvents.map((e) => ({
    id: e.id,
    title: e.title,
    type: e.type,
    dateString: e.dateString,
    time: e.time,
    description: e.description,
    link: e.link,
    image_url: e.image_url,
    image_alt_text: e.image_alt_text,
    is_registration_enabled: e.is_registration_enabled,
    cohort_id: e.cohort_id,
    chapter_slug: e.chapter_slug ?? null,
    chapter_title: e.chapter_title ?? null,
    topic_detail: e.topic_detail ?? null,
    topic_learn: e.topic_learn ?? null,
    topic_theory: e.topic_theory ?? null,
    topic_practice: e.topic_practice ?? null,
    topic_live_session: e.topic_live_session ?? null,
    topic_quiz: e.topic_quiz ?? null,
  }));

  return (
    <>
      <HomePageClient
        mentors={mentors}
        impactStats={impactStats}
        upcomingEvents={formattedUpcomingEvents}
        testimonials={testimonials}
      />
      <StructuredData data={homeStructuredData} />
      <Analytics />
    </>
  );
}
