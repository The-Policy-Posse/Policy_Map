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
    const tabContainer = document.getElementById("general-container");
    if (!tabContainer) {
        console.error("General container element not found.");
        return;
    }

    // Reset the content when no state is selected
    if (!state) {
        // Default content when no state is selected
        showTab('general');
        return;
    }
    // Log the state and district for debugging
    console.log("State:", state);
    console.log("District:", district);
    
    // Ensure members data is loaded
    if (!window.membersData || window.membersData.length === 0) {
        tabContainer.innerHTML = `
            <h2>Loading Data</h2>
            <p>Congress members data is not yet loaded. Please try again in a moment.</p>
        `;
        console.error("Congress members data is not loaded.");
        return;
    }
    // Debug: Log all members data
    console.log("All members data:", window.membersData);

    // Parse district number
    const districtNumber = district ? parseInt(district, 10) :  null;
    if (districtNumber && isNaN(districtNumber)) {
        console.error("Invalid district number:", district);
        tabContainer.innerHTML = `
            <h2>Error</h2>
            <p>Invalid district number provided.</p>
        `;
        return;
    }

    // Filter members by state and district
    const filteredMembers = district
        ? window.membersData.filter(member =>
            member.state === state && 
            parseInt(member.district, 10) === districtNumber &&
            member.chamber === "House of Representatives"
        )
        : window.membersData.filter(member =>
            member.state === state &&
            member.chamber === "Senate"
        );
    console.log("Filtered members:", filteredMembers);

    // Set title based on state and district
    const title = district
        ? `Representative for ${state}, District ${districtNumber}`
        : `Senators from ${state}`;
    tabContainer.innerHTML = `<h2>${title}</h2>`;

    // Render profiles
    if (filteredMembers.length > 0) {
        filteredMembers.forEach(member => {
            const profileDiv = createMemberProfile(member);
            tabContainer.appendChild(profileDiv);
        });
    } else {
        tabContainer.innerHTML += "<p>No members found for this state and district.</p>";
    }
}

function createMemberProfile(member) {
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

    return profileDiv;
}
