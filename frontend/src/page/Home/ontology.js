import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OntologyData() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Ontology Data</h1>
      <div>
        <label>Search: </label>
        <input
          type="text"
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Enter search text"
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Class</th>
            <th>Label</th>
            <th>image</th>
          </tr>
        </thead>
        <tbody>
          {slicedData.map((item, index) => (
            <tr key={index}>
              <td>
                <a href={getRedirectUrl(item.class.value)} target="_blank" rel="noopener noreferrer">
                  {item.class.value}
                </a>
              </td>
              <td>{item.label.value}</td>
              <td>
                {item.image?.value ? (
                  <img src={item.image.value} alt={item.label.value} style={{ width: '100px' }} />
                ) : (
                  'No image available'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default OntologyData;
