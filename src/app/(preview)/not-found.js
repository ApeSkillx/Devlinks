function NotFound() {
  return (
    <div className="flex flex-col gap-5 items-center justify-center">
      <h1 className="text-3xl text-neutral-dark-grey font-bold uppercase">
        User <span className="text-primary-index">not</span> found !
      </h1>
      <p className="text-neutral-grey text-center m-5 mx-10">
        The user you are looking for does not exist. Please make sure the username is correct.
      </p>      
    </div>
  );
}

export default NotFound;
