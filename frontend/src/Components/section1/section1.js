import "./section1.css"
import bg from "./olive.png"

function Section1() {
    return (
        <div>
            <div className="bodyparralax">
                <section className="parallax-container parallax-container2">
                    <div className="cardfilieresbox-parralax">
                        <div className="Aboutus">

                            <img src={bg} alt="" />
                            <div className="Aboutus-box">
                                <div className="Aboutus-title">
                                    WHAT WE DO EXACTLY
                                </div>
                                <div className="Aboutus-p">
                                    We are a team of ingineering students who want to propose a solution for a real problem within our community
                                    We are a team of ingineering students who want to propose a solution for a real problem within our community
                                    We are a team of ingineering students who want to propose a solution for a real problem within our community
                                </div>

                                <div className="Aboutus-p2">
                                    We are a team of ingineering students who want to propose a solution for a real problem within our community
                                </div>
                                <div className="Aboutus-signature">
                                    Help us help our youth

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
export default Section1;