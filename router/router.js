/**
 * Router - Quản lý điều hướng SPA (Single Page Application)
 * Sử dụng hash (#) để chuyển đổi giữa các trang
 * Routes: #/list, #/add, #/edit/:id
 */

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.init();
  }

  /**
   * Đăng ký một route
   * @param {string} path - Đường dẫn route (ví dụ: '/list', '/edit/:id')
   * @param {function} handler - Hàm xử lý khi navigate tới route này
   */
  register(path, handler) {
    this.routes[path] = handler;
  }

  /**
   * Khởi tạo router, bắt sự kiện hash change
   */
  init() {
    window.addEventListener("hashchange", () => this.handleRouteChange());
    // Xử lý route khi trang load lần đầu
    this.handleRouteChange();
  }

  /**
   * Xử lý thay đổi route
   */
  handleRouteChange() {
    const hash = window.location.hash.slice(1) || "/"; // Bỏ dấu # và lấy đường dẫn
    const path = this.parsePath(hash);

    console.log(`[Router] Navigating to: ${hash}`);

    // Tìm route matching
    let matchedRoute = null;
    let params = {};

    for (const [routePath, handler] of Object.entries(this.routes)) {
      const match = this.matchRoute(routePath, path);
      if (match) {
        matchedRoute = handler;
        params = match.params;
        break;
      }
    }

    if (matchedRoute) {
      this.currentRoute = { path, params };
      matchedRoute(params);
    } else {
      console.warn(`[Router] No route found for: ${hash}`);
      // Điều hướng mặc định tới /list
      this.navigate("/list");
    }
  }

  /**
   * Khớp route pattern với actual path
   * Ví dụ: routePath='/edit/:id', path='edit/1' -> { matched: true, params: { id: '1' } }
   */
  matchRoute(routePath, path) {
    const routeParts = routePath.split("/").filter((p) => p);
    const pathParts = path.split("/").filter((p) => p);

    if (routeParts.length !== pathParts.length) {
      return null;
    }

    const params = {};
    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const pathPart = pathParts[i];

      if (routePart.startsWith(":")) {
        // Dynamic parameter
        const paramName = routePart.slice(1);
        params[paramName] = pathPart;
      } else if (routePart !== pathPart) {
        return null; // Không khớp
      }
    }

    return { params };
  }

  /**
   * Parse hash thành path
   */
  parsePath(hash) {
    if (hash.startsWith("/")) {
      return hash.slice(1); // Bỏ dấu / ở đầu
    }
    return hash;
  }

  /**
   * Điều hướng tới một route
   */
  navigate(path, params = {}) {
    let url = path;

    // Thay thế dynamic params trong URL
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(`:${key}`, value);
    }

    window.location.hash = url;
  }

  /**
   * Lấy thông tin route hiện tại
   */
  getCurrentRoute() {
    return this.currentRoute;
  }
}

// Export router instance
export const router = new Router();

/**
 * Hàm helper để điều hướng
 */
export function goTo(path, params = {}) {
  router.navigate(path, params);
}

// Đăng ký các route
router.register("/list", (params) => {
  console.log("Show list page");
  showListPage();
});

router.register("/add", (params) => {
  console.log("Show add form");
  showAddPage();
});

router.register("/edit/:id", (params) => {
  console.log("Edit item with id:", params.id);
  showEditPage(params.id);
});

// Điều hướng
goTo("/list"); // Tới list
goTo("/edit/1"); // Tới edit với id=1
