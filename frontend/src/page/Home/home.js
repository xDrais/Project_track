
import HeroSection from "../../Components/HeroSection/HeroSection"
import Section1 from '../../Components/section1/section1';
import Partenairec from '../../Components/partenairescarousel/partenairec';
import Navbarr from "../../Components/Navbar/navbar";
import OntologyData from './ontology'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
<OntologyData></OntologyData>
    
     <br />
     </>);
}
export default Home