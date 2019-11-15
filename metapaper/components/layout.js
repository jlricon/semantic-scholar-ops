import "../styles/main.css";

function Layout(props) {
  return (
    <div className="flex flex-col container bg-gray-200  h-screen justify-center max-w-screen">
      {props.children}
    </div>
  );
}

export default Layout;
