import ExplorePageWrapper from "../components/pages/explore/ExplorePageWrapper";
import api from "../utils/api";

const ExplorePage = () => {
    return (
        <ExplorePageWrapper />
    )
}

// export async function getStaticProps() {
//     const response = await api.get('/collection/public/featured');
//     const data = response.data;
//     console.log(data);
//     return {
//         props: data
//     }
// }

export default ExplorePage;