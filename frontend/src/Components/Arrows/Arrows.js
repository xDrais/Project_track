
import "./Arrows.css"

function ArrowWrapperLeft({ disabled, onClick,visibility }) {
    return (
      <div
        style={{
          position: "absolute",
          zIndex: "400",
          marginTop: "50%",
          marginLeft: "-120px",
          pointerEvents: disabled ? "none" : "auto", // disable pointer events if disabled is true
          opacity: disabled ? 0.5 : 1, // reduce opacity if disabled is true
          visibility: visibility,
  
        }}
        id="arrow_2"
        className="arrow-wrapper"
        onClick={onClick}
  
      >
        <div className="arrow arrow--left">
        <span style={{fontSize:"10px",width:"80px"}}>Prev</span>
        </div>
      </div>
    );
  }
  
  export {ArrowWrapperLeft};
  
  function ArrowWrapperRight({ disabled, onClick,visibility }) {
    return (
      <div
        style={{
          position: "absolute",
          zIndex: "400",
          marginTop: "195px ",
          marginLeft: "400px",
          pointerEvents: disabled ? "none" : "auto", // disable pointer events if disabled is true
          opacity: disabled ? 0.5 : 1, // reduce opacity if disabled is true
          visibility: visibility,
  
  
        }}
        id="arrow_2"
        className="arrow-wrapper"
        onClick={onClick}
        
        
       
  
  
      >
        <div className="arrow arrow--right">
          <span style={{fontSize:"10px",marginLeft:"-50px",width:"80px"}}>Next</span>
        </div>
      </div>
    );
  }
  
  export {ArrowWrapperRight};