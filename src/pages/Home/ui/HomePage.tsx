import { Header } from "@/widgets/Header";
import styles from "./HomePage.module.scss";
import { Footer } from "@/widgets/Footer";

const HomePage = () => {
  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.content}></main>
      <Footer />
    </div>
  );
};

export default HomePage;
