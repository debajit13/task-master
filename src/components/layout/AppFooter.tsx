const AppFooter = () => {
  return (
    <div className='text-center bg-info fixed-bottom'>
      <p className='m-0 text-dark'>
        &copy; Debajit Mallick {new Date().getFullYear()}
      </p>
    </div>
  );
};
export default AppFooter;
