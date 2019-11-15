import Layout from "../components/layout";

function Home() {
  return (
    // <Layout>
    <div className="flex flex-col bg-gray-300  h-screen justify-center">
      <div className="text-gray-800 mx-auto">
        <h1 className="font-bold  text-6xl">The Beginning of Something New</h1>
        <p className="text-center text-2xl">
          With the new{" "}
          <span className="text-teal-500 font-bold">Fantastic Search</span>{" "}
          everything will be nice
        </p>
      </div>
      {/* <div className="flex"> */}
      {/* <div className=""></div> */}
      <div className=" mx-auto ">
        <input
          className="py-3 px-4 bg-white mt-8 rounded-full shadow-md
      outline-none focus:shadow-xl
       border-transparent
        "
          style={{ minWidth: "500px" }}
        ></input>
      </div>
      {/* <div className=""></div> */}
      {/* </div> */}
    </div>

    // </Layout>
  );
}

export default Home;
