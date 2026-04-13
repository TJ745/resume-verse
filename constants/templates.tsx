export const templates = [
  {
    name: "Modern",
    popular: true,
    preview: (
      <div className="flex flex-col gap-1.5">
        <div
          style={{
            height: 6,
            background: "#c84b2f",
            borderRadius: 1,
            width: "60%",
          }}
        />
        <div
          style={{
            height: 10,
            background: "#2e2c28",
            borderRadius: 1,
            width: "100%",
          }}
        />
        <div
          style={{
            height: 4,
            background: "#2e2c28",
            borderRadius: 1,
            width: "30%",
          }}
        />
        <div style={{ height: 8 }} />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "75%",
          }}
        />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "45%",
          }}
        />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "100%",
          }}
        />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "75%",
          }}
        />
      </div>
    ),
  },
  {
    name: "Classic",
    popular: false,
    preview: (
      <div className="flex flex-col gap-1.5">
        <div
          style={{
            height: 12,
            background: "#2e2c28",
            borderRadius: 1,
            width: "100%",
          }}
        />
        <div
          style={{
            height: 4,
            background: "#2e2c28",
            borderRadius: 1,
            width: "30%",
          }}
        />
        <div style={{ height: 1, background: "#2e2c28", margin: "4px 0" }} />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "75%",
          }}
        />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "100%",
          }}
        />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "45%",
          }}
        />
        <div style={{ height: 4 }} />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "75%",
          }}
        />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "100%",
          }}
        />
      </div>
    ),
  },
  {
    name: "Minimal",
    popular: false,
    preview: (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 6,
          alignContent: "start",
        }}
      >
        <div
          style={{
            gridColumn: "1/-1",
            height: 10,
            background: "#2e2c28",
            borderRadius: 1,
          }}
        />
        <div style={{ height: 6, background: "#2e2c28", borderRadius: 1 }} />
        <div style={{ height: 6, background: "#2e2c28", borderRadius: 1 }} />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "75%",
          }}
        />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "55%",
          }}
        />
        <div style={{ height: 6, background: "#2e2c28", borderRadius: 1 }} />
        <div
          style={{
            height: 6,
            background: "#2e2c28",
            borderRadius: 1,
            width: "75%",
          }}
        />
      </div>
    ),
  },
];
