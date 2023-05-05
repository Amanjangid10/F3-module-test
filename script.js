const IpAddress = document.getElementById("ip");

const Latitude = document.getElementById("lat");
const Longitude = document.getElementById("long");
const City = document.getElementById("city");
const Region = document.getElementById("region");
const Organisation = document.getElementById("org");
const Hostname = document.getElementById("host");
const Time = document.getElementById("time");
const Date = document.getElementById("date");
const Pincode = document.getElementById("pin");

const FilteredData = document.getElementById('filter');






window.addEventListener('load', () => {
    address();
    Data();
})

function address() {
    fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => {
            console.log(data.ip)
            IpAddress.textContent = data.ip;
        })
        .catch(error => {
            console.log('error')
        })
}

function Data() {

    fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => {
            const ip = data.ip;

            return fetch(`https://ipinfo.io/${ip}/geo`)
        })
        .then(res => res.json())
        .then(data => {

            const location = data.loc.split(',');
            const latitude = location[0];
            const longitude = location[1];

            console.log(latitude, longitude);

            document.getElementById('map').innerHTML = `
                                    <iframe
                                         width="100%"
                                         height="500"
                                        frameborder="0"
                                        style="border:0"
                                        src="https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${latitude},${longitude}"
                                        allowfullscreen>
                                    </iframe>

            `



            Latitude.textContent = latitude;
            Longitude.textContent = longitude;

            Region.textContent = data.region;
            City.textContent = data.city;
            Organisation.textContent = data.org;




            const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${latitude},${longitude}`;
            const map = document.getElementById('map');
            map.src = mapUrl;

            const timezone = data.timezone;

            Time.textContent = timezone;
            const currentTime = new Date().toLocaleString('en-US', { timeZone: timezone });
            console.log(currentTime);

            Date.textContent = currentTime;

            const pincode = data.postal;
            fetch(`https://api.postalpincode.in/pincode/${pincode}`)
                .then(response => response.json())
                .then(data => {
                    const postOffices = data[0].PostOffice;
                    // display post offices in console
                    console.log(postOffices);
                    // display post offices on page
                    const searchInput = document.getElementById('search');
                    const results = document.getElementById('results');

                    function displayPostOffices(postOffices) {
                        results.innerHTML = '';
                        postOffices.forEach(postOffice => {
                            const Name = postOffice.Name;
                            const Branch = postOffice.BranchType;
                            const Delivery = postOffice.DeliveryStatus;
                            const District = postOffice.District;
                            const Division = postOffice.Division;

                            document.getElementById('card').innerHTML += `
                                            <div>
                                            <div>Name: <span>${Name}</span></div>
                                            <div>Branch Type: <span >${Branch}</span></div>
                                            <div>Delivery Status: <span>${Delivery}</span></div>
                                            <div>District: <span>${District}</span></div>
                                            <div>Division: <span>${Division}</span></div>
                                            </div>
                                            `;
                            results.appendChild(div);
                        });
                    }








                })
        });
}





FilteredData.addEventListener('input', () => {
        const converted = searchInput.value.trim().toLowerCase();
        const filteredPostOffices = postOffices.filter(postOffice =>
            postOffice.Name.toLowerCase().includes(converted) ||
            postOffice.BranchType.toLowerCase().includes(converted)
        );
        displayPostOffices(filteredPostOffices);
    })
    .catch(error => console.error(error));