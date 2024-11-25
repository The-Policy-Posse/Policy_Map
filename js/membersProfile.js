let membersData = [];

// Fetch Congress members data from the API endpoint
fetch("https://backend-server-304538040372.us-central1.run.app/api/congress_members")
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

    tabContainer.innerHTML = '';

    // Reset the content when no state is selected
    if (!state) {
        // Default content when no state is selected
        showTab('general');
        return;
    }

    // Log the state and district for debugging
    console.log("State:", state, "District:", district);
    
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
        : `Senators`;
    tabContainer.innerHTML = `<h2>${title}</h2>`;

    // Generate individual member profile divs
    const memberProfiles = filteredMembers.map(member => `
        <div class="member-profile" id="member-profile-${member.name}" data-name-id="${member.name}">
            <div class="profile-left">
                <img class="profile-image" src="${member.image_url}" alt="${member.name}'s profile image">
                <div class="member-info">
                    <span><strong>Name:</strong> <span class="member-name" data-name-id="${member.name}">${member.name}<span><br>
                    <span><strong>Party:</strong> ${member.party}<span><br>
                    <span><strong>Chamber:</strong> ${member.chamber}<span><br>
                    ${
                        member.chamber === "House of Representatives"
                            ? `<span><strong>District:</strong> ${parseInt(member.district, 10)}<span><br>`
                            : ""
                    }
                    <span><strong>Active:</strong> ${member.start_year} - Present<span><br>
                    <span><strong>Bills Sponsored:</strong> ${member.sponsored_bills}<span><br>
                    <span><strong>Bills Cosponsored:</strong> ${member.cosponsored_bills}<span><br>
                </div>
            </div>
            <div class="profile-right">
                <span><strong>Address:</strong> ${member.address}<span><br>
                <span><strong>Phone:</strong> ${member.phone_number}<span><br>
                <span><strong>Website:</strong> <a href="${member.website_url}" target="_blank">${member.website_url}</a><span>
                ${
                    member.chamber === "House of Representatives"
                        ? `<span><strong>Committee Assignments:</strong> ${member.committee_assignment}<span>`
                        : ""
                }
            </div>
        </div>
    `).join('');
    
    return `
        <div class="member-profiles">
            <h3>${district ? `Representative` : 'Senators'}</h3>
            ${memberProfiles}
        </div>
    `;
}

