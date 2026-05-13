import { Hero } from "@/components/hero";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { hasEnvVars } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col gap-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 p-6">
      <Hero />
      <section className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </section>
    </div>
  );
}