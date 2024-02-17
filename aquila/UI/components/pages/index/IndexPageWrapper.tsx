import MainLayout from "../../layout/main/MainLayout";
import AllControl from "./AllControl";
import Discover from "./Discover";
import Hero from "./Hero";
import Story from "./Story";

const IndexPageWrapper = () => {
	return (
		<MainLayout headerBorder={false}>
			<Hero />
			<Discover />
			<AllControl />
			<Story />
		</MainLayout>
	)
}

export default IndexPageWrapper;