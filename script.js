const main = async () => {
   const html = `
    <div>
      ${imageUrls.map(i => `<img src="${i.thumbnail}i" />`)}
    </div>
  `

  document.body.innerHTML = html;

  console.log(imageUrls);
};

function History() {
  const images = JSON.parse(localStorage.getItem("ireedapoem.images"));

  if(!images) {
    return null;
  }

  return (
    <div>
      <h1>hisstori 🐍</h1>
      {images.map((image) => (
        <a href={image.url}>
          <img src={image.thumbnail} />
        </a>
      ))}
    </div>
  );
}

function BigList() {
  const [imageUrls, setImageUrls] = React.useState(null);

  const onClick = (item) => (e) => {
    let images = JSON.parse(localStorage.getItem("ireedapoem.images"));

    if(!images) {
      images = [];
    }

    images.unshift(item);

    localStorage.setItem("ireedapoem.images", JSON.stringify(images));

    window.location.assign(item.url);
  };

  React.useEffect(() => {
    async function fetchUrls() {
      try {
        let imageUrls = [];
        let after;

        for(let pages = 5; pages > 0; pages--) {
          let newImagesUrls = await fetch(`https://www.reddit.com/r/ilikthebred/top.json?t=all&limit=100&after=${after}`)
            .then(r => r.json())
            .then(j => {
              after = j.data.after;
              return j;
            })
            .then(j => {
              return j.data.children
                .filter(c => c.data.link_flair_text !== 'RIP')
                .filter(c => /\.(jpg|jpeg|gif|png|gif)$/.test(c.data.url))
                .map((c) => ({
                  thumbnail: c.data.thumbnail,
                  url: c.data.url
                }));
            });

          imageUrls = imageUrls.concat(newImagesUrls);
        }

        setImageUrls(imageUrls);
      } catch(e) {
        console.error(e)
      }
    }

    fetchUrls();
  }, [ ]);

  if(!imageUrls) {
    return <h1>plz wate lowdin</h1>;
  }

  return (
    <div>
      {imageUrls.map((item) => (
        <a onClick={onClick(item)}>
          <img src={item.thumbnail} />
        </a>
      ))}
    </div>
  );
}

function App() {
  return(
    <div>
      <History />
      <BigList />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"));
