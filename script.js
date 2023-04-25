const APIURL = 'https://api.github.com/users/'

const form = document.getElementById('form')
const main = document.getElementById('main')
const search = document.getElementById('search')

async function getUser(username){
    try{
        const {data} = await axios(APIURL + username)
        createUserCard(data);
        getRepos(username)
    }catch(err) {
        if(err.response.status == 404) {
            createErrorCard('No pofile with this username');
        }
    }
}

async function getRepos(username) {
    try{
        const {data} = await axios(APIURL + username + '/repos?sort=created')
        addreposToCard(data);
    }catch(err) {
        if(err.response.status == 404) {
            createErrorCard('Problem Fetching repos');
        }
    }
}

function addreposToCard(repos) {
  const reposEl = document.getElementById('repos')

  repos.slice(0, 10).forEach(repo => {
    const repoEl = document.createElement('a')
    repoEl.classList.add('repo')
    repoEl.href = repo.html_url
    repoEl.target = '_blank'
    repoEl.innerText = repo.name

   reposEl.appendChild(repoEl)
  });
}


function createErrorCard(message) {
    const cardHTML = `
     <div class="w-full lg:max-w-3xl rounded-2xl shadow-xl flex flex-col items-center justify-between border-cyan-300 sm:flex-row p-2 md:p-12 my-0">
       <h1 class="text-xl text-center">${message}</h1>
     </div>
    `
    main.innerHTML = cardHTML;
}

function createUserCard(user) {
    const cardHTML = `
    <div class="card">
    <div>
        <img src="${user.avatar_url}" alt="${user.name}" class="avatar w-40 h-40">
    </div>
    <div class="text-white md:ml-8">
        <h2 class="card_h2">${user.name}</h2>
        <p class="mb-2">${user.bio}</p>
        <ul class="card_ul">
            <li class="card_li">${user.followers}<strong class="card_strong">Followers</strong></li>
            <li class="card_li">${user.following}<strong class="card_strong">Following</strong></li>
            <li class="card_li">${user.public_repos}<strong class="card_strong">Repos</strong></li>
        </ul>
        <div id="repos">
        </div>
    </div>
  </div>
    `
main.innerHTML = cardHTML

}

function SubmitEvent() {
    const user = search.value

    if(user) {
        getUser(user)
    }
}
document.body.addEventListener('load', SubmitEvent())
form.addEventListener('submit', (e) =>{
    e.preventDefault()
    SubmitEvent()
})

