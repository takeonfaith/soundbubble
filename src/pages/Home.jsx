import '../styles/HomePage.css'
import { MainBanner } from '../components/HomePage/MainBanner'
import { RecentSongs } from '../components/HomePage/RecentSongs'
import { RecommendedAuthors } from '../components/HomePage/RecommendedAuthors'
import { RecommendedSongs } from '../components/HomePage/RecommendedSongs'
import { Top15Songs } from '../components/HomePage/Top15Songs'

export const Home = () => {

	return (
		<div style={{ animation: 'zoomIn .2s forwards' }} className="HomePage">
			<MainBanner />
			<RecentSongs />
			<Top15Songs />
			<RecommendedSongs />
			<RecommendedAuthors />
		</div>
	)
}
