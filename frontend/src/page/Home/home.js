
import HeroSection from "../../Components/HeroSection/HeroSection"
import Section1 from '../../Components/section1/section1';
import Partenairec from '../../Components/partenairescarousel/partenairec';
import Navbarr from "../../Components/Navbar/navbar";

function Home(){
return(
<>
<Navbarr />
<HeroSection />
{/* <div align="center" className="eventbackground">
<Events/> </div> */}
     <Section1 />
     <div>
</div>
<br />
     <Partenairec />
     <br />
     </>);
}
export default Home