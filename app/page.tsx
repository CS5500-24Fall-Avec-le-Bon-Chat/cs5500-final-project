import styles from "./page.module.css";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.page}>
      <h2>Home Page</h2>
      <Link href="/login" className={buttonVariants({ variant: "outline" })}>
        Go to Login Page
      </Link>
    </div>
  );
}
