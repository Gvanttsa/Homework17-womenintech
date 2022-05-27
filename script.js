let mainWrapperPost = document.getElementById('post-block');
let overLayContent = document.getElementById('overlay');
let closeOcerley = document.getElementById('close');
let content = document.getElementById('content');
let addButton = document.getElementById('add');
let Overlay = document.getElementById('postoverlay');
let form = document.getElementById('form');
let saveData = document.getElementById('savadata')

//ამ ფუნქციის საშუალებით ვაგზავნი მოთხოვნას სერვერზე
//https://jsonplaceholder.typicode.com/posts
function ajax (url, callback) {
    let requist = new XMLHttpRequest();
    requist.open('GET', url);
    requist.addEventListener('load', function() {
        let data = JSON.parse(requist.responseText);
        callback(data); //აქ ვიძახებ callback- ის ფუნქციას
    });

    requist.send();
 }

 ajax('https://jsonplaceholder.typicode.com/posts', function(data) { //ეს არის ajax-ის ფუნქცისის გამოძახება, ამ გამოძახების დრო გადაეცემა კიდე ორი პარამეტრი, ერთი იქნება ლინკი, მეორე ფუნქცია
     printData(data); //აქ ვიძახებ printData-ს ფუქნციას
 });

 function printData(data) {
    data.forEach(element => {           //იმისთვის რომ შევქმნა იმდენი დივი რამდენი პოსტიც მაქვს
        createPost(element);            // იმ ფუნქციას, რომლის მეშვეობითაც შევქმენი პოსტები გამოვიძახებ აქ და გადავცემ element-ს
    });
 }

// ამ ფუმქციის საშუელებით ვქმნი პოსტებს
function createPost(item) {
    let divWrapper = document.createElement('div');
    divWrapper.classList.add('posts');
    divWrapper.setAttribute('data-id', item.id) //იმისთვის დავწერეთ, რომ პოსტს რომ დავაკლიკებთ, წამოიღოს პოსტის შესაბამის ინფორმაცია

    let h2Tag = document.createElement('h.2');
    h2Tag.innerText = item.id;

    let h3Tag = document.createElement('h3');
    h3Tag.innerText = item.title;

    let deleteButton = document.createElement('button');  //პოსტის წაშლის მაგალითისთვის
    deleteButton.innerText = 'DELETE POST';
    deleteButton.setAttribute('data-id', item.id);   // ამ ღილაკსაც უნდა გავატანოთ data-id, რადგან უნდა გავიგო კონკრეტულად რომელი პოსტის წაშლის ღილაკს დავაჭირე.

    divWrapper.appendChild(h2Tag);
    divWrapper.appendChild(h3Tag);
    divWrapper.appendChild(deleteButton); //პოსტის წაშლის მაგალითისთვის

    divWrapper.addEventListener('click', function(event) {
        let id = event.target.getAttribute('data-id'); //divWrapper-ის მნიშვნელობას ავირებ და ჩავაგდებ id-ის ცვლადში.
                                                      //let id იმიტომ შევქმენით, რომ წამოიღოს პოსტის შესაბამისი ინფპ, ანუ თუ მაგალითად 6 პოსტს დავაჭირე წამოიღოს მეექვსეს ინფო.
        openOverlay(id);
    })

    deleteButton.addEventListener('click', function (event) {          //delete button - ს უნდა დავუუმატო click event-ი
        event.stopPropagation(); //მემკვიდერობით რომ არ გადაეცეს ქლიკ ევენთი, და წაშლის ღილაკს რომ დავაწვებით პოსტის ინფიო კი არ აწამოიღოს, არამედ წაიშალოს
        let id = event.target.getAttribute('data-id');
        deletePost(id);  //deletePost-ის ფუნქციას აქ ვიძახებთ

    })            
    mainWrapperPost.appendChild(divWrapper);

    console.log(divWrapper);
}


function openOverlay (id) {  //ამ ფუნქციას ვიძახებთ add.eventListener-ში, მასაც გადაეცემა id
    overLayContent.classList.add('active');
    let url = `https://jsonplaceholder.typicode.com/posts/${id}`//დინამიურად მინდა რომ ჩავარდეს ის id, რომელ პოსტსაც დავაწვები

    ajax(url, function(data) {    //აქ თავიდან უნდა გამოვიძახოთ ajax-ის ფუნქცია, რადგან თავიდან უნდა წავიდე ახალ ლინნკზე
        overlayFunction(data);   //აქ ვიძახებ OVERLAYfUNCTIONS, რომელსაც გადაეცემა ჩვენი მოსული ინფო (data)
    })
    console.log(id);
}

function deletePost(id) {    //წაშლის მაგალისთისთვის
    let url = `https://jsonplaceholder.typicode.com/posts/${id}`;
    fetch(url, {
        method: 'DELETE'
    })
}


function overlayFunction (item1) {     //აღწერის შესაქმნელად
     let titlePost = document.createElement('h3');
     titlePost.innerText = item1.title;
    
    let description = document.createElement('p')
     description.innerText = item1.body;

     content.appendChild(titlePost);
     content.appendChild(description);

}

closeOcerley.addEventListener('click', function() {
    overLayContent.classList.remove('active'); //იმისთვის რომ x ღილაკს როცა დავაწვები overlay-ი გაქრეს
    content.innerHTML = ' '; // კონტენტი იმისთვის უნდა გავასუფთაოთ, რომ ერთ პოსტს როცა დავაწვენით იმახსოვრებს მის ინფოს, მეორეს რომ დავაწევები ორივე პოსტის ინფოს ერთად აგდებს ეს არ უნდქა მოხდეს 
})

//როდესაც დავაწვები addButtons, მაშინ postOverlay-ს მინდა დაემატოს ახალი კლასის სახელი
addButton.addEventListener('click', function() {
    Overlay.classList.add('active-add');
})

form.addEventListener('submit', function(event) { //იმისთვის რომ სუბმითს რომ დავაწვები გვერდი არ დარეფრეშდეს
    event.preventDefault();

    let formData = {                              //ვიღებ ინფუთში ჩაწერილი ინფორმაციას
        title: event.target[0].value,
        description: event.target[1].value       //ეს არის ჯს-ს ობიექტი და უნდა გადავაკეთოთ სტრინგად 
    }

    fetch('https://jsonplaceholder.typicode.com/posts', { //სად ვაგზავნით ინფოს
      method: 'POST',  //რა მეთოდს ვიყენებთ
      body: JSON.stringify(formData), //ვამატებთ პოსტის მეორე ატრიბუტს, body-ს, რომელაც გადაეცემა ფორმა, რომელსაც ვაგზავნით
      headers: {
         'Content-type': 'application/json; charset=UTF-8',
    },
  })
  .then((response) => response.json())
  .then((json) => console.log(json));
      postOverlay.classList.remove('active-add');
    
    console.log(formData);
    
})

saveData.appendChild(formData);

