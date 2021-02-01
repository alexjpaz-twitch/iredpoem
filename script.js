const main = async () => {
   const html = `
    <div>
      ${imageUrls.map(i => `<img src="${i.thumbnail}i" />`)}
    </div>
  `

  document.body.innerHTML = html;

  console.log(imageUrls);
};

function App() {
  const [imageUrls, setImageUrls] = React.useState(null);

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
      {imageUrls.map((imageUrl) => (
        <a href={imageUrl.url}>
          <img src={imageUrl.thumbnail} />
        </a>
      ))}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
