import IconCode from "../icons/IconCode";

export default function Footer() {
  return (
    <footer>
      <p>Made by <a href="https://github.com/Mavulp/" target="_blank">Mavulp</a> <IconCode /> in {new Date().getFullYear()}</p>
    </footer>
  )
}