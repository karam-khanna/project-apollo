const interestarray = [["Poker"],["Soccer"],["Poker","Soccer"]]

function Profile ({fname,lname,email,picture,interest}) {
    return (<div className="max-w-md mx-auto mt-10 p-6 bg-neutral-700 bg-opacity-50 rounded shadow-lg grid grid-cols-3 gap-4">
        <img
        src={picture} // Replace with the image URL
        className="row-span-2 self-end"
        alt="Image Description"
       
        />
        <div className="col-span-2">Name: {fname+" "+lname}</div>
        <div className="col-span-2">Email: {email}</div>

        <div className="col-span-3">Interest: {interest.map((x)=>(<span className="p-1 rounded-t-md rounded-b-lg">{x}</span>)) } </div>
        
    </div>)
    
}

import React, { useState, useEffect } from "react";

const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use the useEffect hook to fetch data when the component mounts
    fetch("https://randomuser.me/api/") // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        setData(data); // Update the state with the fetched data
        setLoading(false); // Set loading to false
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false in case of an error
      });
  }, []); // Empty dependency array ensures the effect runs once on mount

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        Profile ({fname:data.results[0].name.first,lname:data.results[0].name.last,email:data.results[0].email,picture:data.results[0].picture.large,interest:interestarray[Math.floor(Math.random()*3)]})
      )}
    </div>
  );
};

export default MyComponent;







