import Link from 'next/link'

export default function Footer() {
	return (
    <footer className="mt-5">
      <div className="container">
        <div className="divider" />
        <div className="row">
          <div className="col-md-6 copyright text-xs-center">
            <p>
              Copyright 2025 Merinda inc. Designed by <a href="https://alithemes.com">AliThemes.com</a>
            </p>
          </div>
          <div className="col-md-6">
            <ul className="social-network inline text-md-end text-sm-center">
              <li className="list-inline-item">
                <Link href="#">
                  <i className="icon-facebook" />
                </Link>
              </li>
              <li className="list-inline-item">
                <Link href="#">
                  <svg
                    style={{
                      width: 10,
                      height: 10,
                      color: "rgba(0, 0, 0, 0.54)",
                      marginTop: "-3px",
                    }}
                    id="fi_5968958"
                    enableBackground="new 0 0 1226.37 1226.37"
                    viewBox="0 0 1226.37 1226.37"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m727.348 519.284 446.727-519.284h-105.86l-387.893 450.887-309.809-450.887h-357.328l468.492 681.821-468.492 544.549h105.866l409.625-476.152 327.181 476.152h357.328l-485.863-707.086zm-144.998 168.544-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721h-162.604l-323.311-462.446z" />
                  </svg>
                </Link>
              </li>
              <li className="list-inline-item">
                <Link href="#">
                  <i className="icon-behance" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
