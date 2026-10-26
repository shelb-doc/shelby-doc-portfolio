const fs = require("fs");
const path = require("path");
const { within } = require("@testing-library/dom");

describe("Featured project links", () => {
  let projectsSection;

  beforeEach(() => {
    const html = fs.readFileSync(
      path.resolve(__dirname, "../index.html"),
      "utf8",
    );
    document.body.innerHTML = html;
    projectsSection = document.querySelector("#projects");
  });

  test.each([
    {
      projectName: "Bash File Organizer",
      repository: "https://github.com/shelb-doc/bash-file-organizer",
    },
    {
      projectName: "ProBet Sports",
      repository: "https://github.com/shelb-doc/ProBet-Sports",
    },
    {
      projectName: "Quality Command Center",
      repository: "https://github.com/shelb-doc/quality-command-center",
    },
  ])(
    "$projectName has an accessible, safe GitHub repository link",
    ({ projectName, repository }) => {
      const heading = within(projectsSection).getByRole("heading", {
        level: 3,
        name: projectName,
      });
      const projectCard = heading.closest(".project-card");

      expect(projectCard).toBeInTheDocument();

      const link = within(projectCard).getByRole("link", {
        name: "View source on GitHub",
      });

      expect(link).toHaveAttribute("href", repository);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    },
  );
});
