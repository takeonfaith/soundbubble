import { MainBanner } from "../../features/home/ui/organisms/main-banner";
import { RecentSongs } from "../../features/home/ui/organisms/recent-songs";
import { RecommendedAuthors } from "../../features/home/ui/organisms/recommended-authors";
import { RecommendedSongs } from "../../features/home/ui/organisms/recommended-songs";
import { Top15Songs } from "../../features/home/ui/organisms/top-15-Songs";
import { ContentContainer } from "../../shared/ui/atoms/content-container";
import "./style.css";

const HomePage = () => {
  return (
    <div style={{ animation: "zoomIn .2s forwards" }} className="HomePage">
      <MainBanner />
      <ContentContainer>
        <RecentSongs />
        <Top15Songs />
        <RecommendedSongs />
        <RecommendedAuthors />
      </ContentContainer>
    </div>
  );
};

export default HomePage;
