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

  test.each([
    {
      projectName: "Bash File Organizer",
      qualityFocus: /file handling.*reusable functions.*edge-case validation/i,
    },
    {
      projectName: "ProBet Sports",
      qualityFocus: /data-testid.*API-fed choices.*form validation/i,
    },
    {
      projectName: "Quality Command Center",
      qualityFocus:
        /release readiness.*production triage.*exploratory testing.*automation refactoring/i,
    },
  ])(
    "$projectName explains its quality focus",
    ({ projectName, qualityFocus }) => {
      const heading = within(projectsSection).getByRole("heading", {
        level: 3,
        name: projectName,
      });
      const projectCard = heading.closest(".project-card");

      expect(projectCard.querySelector(".project-proof")).toHaveTextContent(
        qualityFocus,
      );
    },
  );
});

describe("Hiring highlights", () => {
  let html;

  beforeEach(() => {
    html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf8");
    document.body.innerHTML = html;
  });

  test("resume request is prominent and uses the portfolio email", () => {
    const resumeLink = within(document.querySelector(".hero")).getByRole(
      "link",
      { name: "Request résumé" },
    );

    expect(resumeLink).toHaveAttribute(
      "href",
      "mailto:shelbycignetti@gmail.com?subject=Senior%20SDET%20resume%20request",
    );
  });

  test("career metrics are attributed to the listed Repisodic role", () => {
    const hero = document.querySelector(".hero");
    const statsContext = within(hero).getByText("Repisodic · Jun 2023–Jun 2024");
    const statLabels = Array.from(hero.querySelectorAll(".stat-label")).map(
      (label) => label.textContent.trim(),
    );

    expect(statsContext).toBeInTheDocument();
    expect(statLabels).toEqual([
      "SaaS releases tested",
      "Test coverage increase",
      "Fewer post-release issues",
    ]);
  });

  test("recent impact highlights summarize current SDET work", () => {
    const impact = document.querySelector("#recent-impact");

    expect(
      within(impact).getByRole("heading", {
        level: 2,
        name: "Quality work, in practice",
      }),
    ).toBeInTheDocument();
    expect(impact.querySelectorAll(".impact-card")).toHaveLength(3);
    expect(impact).toHaveTextContent("Ruby/Cucumber");
    expect(impact).toHaveTextContent("AWS region and SSM configuration");
    expect(impact).toHaveTextContent("standardized Faker data");
  });

  test("performance testing and JWT skills are clearly marked as in progress", () => {
    const skillCard = Array.from(
      document.querySelectorAll("#skills .skill-card"),
    ).find((card) =>
      card.querySelector("h3")?.textContent.includes("Performance & JWT"),
    );

    expect(skillCard).toBeInTheDocument();
    expect(skillCard).toHaveClass("skill-card-learning");
    expect(skillCard).toHaveTextContent("Currently learning");
    expect(skillCard).toHaveTextContent("Apache JMeter");
    expect(skillCard).toHaveTextContent("Performance Testing");
    expect(skillCard).toHaveTextContent("JWT Validation");
    expect(skillCard).toHaveTextContent("API Authentication");
    expect(skillCard).toHaveTextContent("no wizard claims yet");
  });
});
