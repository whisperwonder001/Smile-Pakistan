import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { NewBlogPostForm } from "@/features/admin/NewBlogPostForm";
import { BlogRowActions } from "@/features/admin/BlogRowActions";

export default async function AdminBlogPage() {
  const posts = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <Reveal className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-text">Blog CMS</h1>
          <p className="mt-1 text-sm text-muted">{posts.length} posts.</p>
        </div>
        <NewBlogPostForm />
      </Reveal>

      <div className="mt-8 space-y-3">
        {posts.length === 0 && <p className="text-sm text-muted">No posts yet.</p>}
        {posts.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.05}>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-display text-sm font-bold text-text">{p.title}</p>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                      p.status === "Published" ? "bg-success/10 text-success" : "bg-slate-200 text-muted"
                    )}
                  >
                    {p.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">{p.excerpt}</p>
              </div>
              <BlogRowActions id={p.id} status={p.status} />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
