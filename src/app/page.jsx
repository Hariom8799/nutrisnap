import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <h1 className="text-4xl font-bold mb-6">Welcome to HealthifyMe Clone</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Track your nutrition, manage your calories, and achieve your health goals with ease.
      </p>
      <div className="space-x-4">
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/log-food">Log Food</Link>
        </Button>
      </div>
    </div>
    </>
  );
}
