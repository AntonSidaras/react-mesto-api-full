import React from 'react';

function Loader({isVisible, image}){
  return(
    <section className={`loader ${isVisible ? "loader_opened" : ""}`}> 
      <div className="loader__background" style={{backgroundImage: `url(${image})`}} />
    </section>
  );
}

export default Loader;