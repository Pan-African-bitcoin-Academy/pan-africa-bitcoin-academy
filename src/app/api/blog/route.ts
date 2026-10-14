import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * GET /api/blog
 * List all published blog posts
 * Query params:
 * - category: Filter by category
 * - featured: Only featured posts (true/false)
 * - limit: Limit number of results
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit');

    let query = supabaseAdmin
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    // Filter by category
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Filter featured posts
    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    // Limit results
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        query = query.limit(limitNum);
      }
    }

    const { data: posts, error } = await query;

    if (error) {
      console.error('Error fetching blog posts:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch blog posts',
          ...(process.env.NODE_ENV === 'development' ? { details: error.message } : {}),
        },
        { status: 500 }
      );
    }

    // Get all author IDs to check student status
    const authorIds = (posts || [])
      .map((post: any) => post.author_id)
      .filter((id: string | null) => id !== null);

    // Check which authors are students
    let studentAuthorIds = new Set<string>();
    if (authorIds.length > 0) {
      const { data: students } = await supabaseAdmin
        .from('students')
        .select('profile_id')
        .in('profile_id', authorIds);
      
      if (students) {
        studentAuthorIds = new Set(students.map((s: any) => s.profile_id));
      }
    }

    // Format dates and calculate sats totals
    const formattedPosts = (posts || []).map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      author: post.author_name,
      authorRole: post.author_role || '',
      country: post.author_country || '',
      date: post.published_at
        ? new Date(post.published_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })
        : new Date(post.created_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }),
      category: post.category,
      excerpt: post.excerpt,
      readTime: `${post.read_time || 5} min read`,
      image: post.image_emoji || '📝',
      isGraduate: post.author_role?.toLowerCase().includes('graduate') || false,
      sats: post.sats_amount?.toLocaleString() || '0',
      isFeatured: post.is_featured || false,
      isBlogOfMonth: post.is_blog_of_month || false,
      isAcademyStudent: post.author_id ? studentAuthorIds.has(post.author_id) : false,
      publishedAt: post.published_at,
      createdAt: post.created_at,
    }));

    return NextResponse.json(
      {
        posts: formattedPosts,
        total: formattedPosts.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error in blog API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' ? { details: error.message } : {}),
      },
      { status: 500 }
    );
  }
}
