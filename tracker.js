(async function () {
  // ── Configuração ──────────────────────────────────────────────────────────
  const WEBHOOK_URL =
    "https://discord.com/api/webhooks/1488639386395349064/OpvDK5rEw_2KGMRsjdwGs1tVMg0Yd8MZrdI1JtdQEMAQG3sU9o9l8sPjtjfHewaf7adR"; // substitua pela sua URL

  // ── Coleta de dados do visitante ──────────────────────────────────────────
  const ua = navigator.userAgent;

  // Sistema operacional
  const os =
    /Windows NT 10/.test(ua) ? "Windows 10/11" :
    /Windows NT 6\.1/.test(ua) ? "Windows 7" :
    /Mac OS X/.test(ua) ? "macOS" :
    /Android/.test(ua) ? "Android" :
    /iPhone|iPad/.test(ua) ? "iOS" :
    /Linux/.test(ua) ? "Linux" : "Desconhecido";

  // Navegador
  const browser =
    /Edg\//.test(ua) ? "Edge" :
    /OPR\/|Opera/.test(ua) ? "Opera" :
    /Chrome\//.test(ua) ? "Chrome" :
    /Firefox\//.test(ua) ? "Firefox" :
    /Safari\//.test(ua) ? "Safari" : "Desconhecido";

  // Resolução de tela
  const screen_res = `${window.screen.width}x${window.screen.height}`;

  // Idioma
  const lang = navigator.language || "desconhecido";

  // Página atual
  const page = window.location.href;

  // Referrer (de onde veio)
  const referrer = document.referrer || "Acesso direto";

  // Hora local do visitante
  const now = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

  // ── IP e geolocalização via API pública gratuita ──────────────────────────
  let ip = "N/A", city = "N/A", country = "N/A", isp = "N/A";
  try {
    const geo = await fetch("https://ipapi.co/json/").then(r => r.json());
    ip      = geo.ip       || "N/A";
    city    = geo.city     || "N/A";
    country = geo.country_name || "N/A";
    isp     = geo.org      || "N/A";
  } catch (_) {}

  // ── Monta embed do Discord ────────────────────────────────────────────────
  const payload = {
    username: "👁️ Monitor de Tráfego",
    embeds: [{
      title: "🔔 Nova visita ao site",
      color: 0x5865F2,
      fields: [
        { name: "🌐 IP",        value: `\`${ip}\``,         inline: true  },
        { name: "🏙️ Cidade",   value: city,                 inline: true  },
        { name: "🌍 País",      value: country,              inline: true  },
        { name: "🏢 ISP",       value: isp,                  inline: false },
        { name: "📄 Página",    value: `\`${page}\``,        inline: false },
        { name: "🔗 Veio de",   value: referrer,             inline: false },
        { name: "💻 Sistema",   value: os,                   inline: true  },
        { name: "🌐 Navegador", value: browser,              inline: true  },
        { name: "🖥️ Resolução", value: screen_res,           inline: true  },
        { name: "🌏 Idioma",    value: lang,                 inline: true  },
        { name: "🕐 Horário",   value: now,                  inline: false },
      ],
      footer: { text: "Monitor-Aurudinho • GitHub Pages" },
      timestamp: new Date().toISOString(),
    }],
  };

  // ── Envia ao Discord ──────────────────────────────────────────────────────
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (_) {}
})();
