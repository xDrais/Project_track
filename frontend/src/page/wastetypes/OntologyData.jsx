import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OntologyData.css'; 
import Navbarr from "../../Components/Navbar/navbar";
import video from "./pottery2.mp4"

function OntologyData() {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
  
    const redirectionMap = {
      'http://webprotege.stanford.edu/RCIF5UBvU8sg9RqBpuLmld': 'https://en.wikipedia.org/wiki/Computer_monitor',  
      'http://webprotege.stanford.edu/R7hre9EQ8HbqWJu7esNwsw1' : 'https://secretsofparis.com/practical/pharmacies/',
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/getClassbyLabel?classname=${searchText}`
          );
          setData(response.data.results.bindings);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchData();
    }, [searchText]);
  
    const handleSearchChange = (event) => {
      setSearchText(event.target.value);
      setCurrentPage(1); // Reset to the first page when searching
    };
  
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const slicedData = data.slice(startIndex, endIndex);
  
    const goToPage = (page) => {
      setCurrentPage(page);
    };
  
    const getRedirectUrl = (ontologyUrl) => {
      // Use the ontology URL to find the corresponding real webpage URL
      return redirectionMap[ontologyUrl] || ontologyUrl; // Fallback to the ontology URL if no mapping is found
    };

  return (
    <>
    <Navbarr></Navbarr>
    <video className="fullscreen-video" src={video} autoPlay loop muted />
    <div className="ontology-container">
 <br></br>
 <br></br>
 <br></br>
 <br></br>
 <br></br>
 <br></br>
      <h1>Waste Types</h1>
      <input
        className="search-input"
        type="text"
        value={searchText}
        onChange={handleSearchChange}
        placeholder="Enter search text"
      />
      <div className="card-container">
        {slicedData.map((item, index) => (
          <div key={index} className="card">
            <div className="card-content">
              <a href={getRedirectUrl(item.class.value)} target="_blank" rel="noopener noreferrer">
                <div className="class">{item.class.value}</div>
              </a>

              <div className="label">{item.label.value}</div>
              <div className="label">{item.wastetype?.value}</div>
              <div className="image">
                {item.image?.value ? (
                  <img src={item.image.value} alt={item.label.value} />
                ) : (
                  <span>No image available</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination"  >
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
    </>
  );
}

export default OntologyData;
