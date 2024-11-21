let membersData = [];

// Fetch Congress members data from the API endpoint
fetch("http://localhost:5001/api/congress_members")
    .then(response => response.json())
    .then(data => {
        // Store data in the 'membersData' global variable
        window.membersData = data.members;
        console.log("Congress members data:", window.membersData);
    })
    .catch(error => {
        console.error("Error fetching congress members data:", error);
    });

function showModalForState(state, district = null) {
    const tabContent = document.getElementById("tab-content");
    if (!tabContent) {
        console.error("Tab content element not found.");
        return;
    }
    // Clear all previous content in the 'tab-content' area
    if (!state) {
        // Default content when no state is selected
        showTab('general');
        return;
    }
    const generalTab = document.getElementById("general");
    if (generalTab) {
        // Update only the content of the general tab
        generalTab.innerHTML = `
            <h2>Senators from ${state}</h2>
            <p>Select a District to view specific information.</p>
        `;
    }
    // Convert district to int
    const districtNumber = parseInt(district, 10);
    // Filter members data for the selected state and optionally a specific district
    let filteredMembers = [];
    if (district) {
        // Filter for House members
        filteredMembers = window.membersData.filter(member =>
            member.state === state && parseInt(member.district, 10) === districtNumber && member.chamber === "House of Representatives"
        );
    } else {
        // Filter for Senate members
        filteredMembers = window.membersData.filter(member =>
            member.state === state && member.chamber === "Senate"
        );
    }
     // Clear previous profiles in the modal
     //const tabContent = document.getElementById("tab-content");
     if (tabContent) {
        // Set title based on the state and district
        const title = district 
            ? `Representative for ${state}, District ${districtNumber}` 
            : `Senators from ${state}`;
        tabContent.innerHTML = `<h2>${title}</h2>`;
        // Create a profile for each member in the state
        if (filteredMembers.length > 0) {
            filteredMembers.forEach(member => {
                const profileDiv = document.createElement("div");
                profileDiv.classList.add("member-profile");
                // Add profile image
                const img = document.createElement("img");
                img.classList.add("profile-image");
                img.src = member.imageUrl;
                img.alt = `${member.name}'s profile image`;
                // Add member details
                const infoDiv = document.createElement("div");
                infoDiv.classList.add("member-info");
                infoDiv.innerHTML = `
                    <strong>Name: ${member.name}</strong>
                    Party: ${member.partyName}<br>
                    Chamber: ${member.chamber}<br>
                    ${
                        member.chamber === "House of Representatives"
                            ? `District: ${parseInt(member.district, 10)}<br>`
                            : ""
                    }
                    Active: ${member.startYear} - Present<br>
                    <a href="${member.url}" target="_blank">Website</a>
                `;
                // Append elements to the profile div
                profileDiv.appendChild(img);
                profileDiv.appendChild(infoDiv);
                // Append profile div to the modal
                tabContent.appendChild(profileDiv);
            });
        } else {
            tabContent.innerHTML = "No members found for this state and district.";
        }
    }
}
