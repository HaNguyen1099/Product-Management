const Role = require("../../models/role.model")

const systemConfig = require("../../config/system")

// [GET] /admin/roles/
module.exports.index = async (req, res) => {
    let find = {
        deleted: false 
    }

    const records = await Role.find(find)

    res.render("admin/pages/roles/index", {
        pageTitle: "Nhóm quyền",
        records: records
    })
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Thêm mới nhóm quyền",
    })
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    const role = new Role(req.body)
    await role.save()

    res.redirect(`${systemConfig.prefixAdmin}/roles`)
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id

        const data = await Role.findOne({_id: id, deleted: false})

        res.render("admin/pages/roles/edit", {
            pageTitle: "Chỉnh sửa nhóm quyền",
            data: data
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id 

        await Role.updateOne({ _id : id}, req.body)

        req.flash("success", "Cập nhật nhóm quyền thành công!")
    } catch (error) {
        req.flash("error", "Cập nhật nhóm quyền thất bại!")
    }
    
    res.redirect("back")
}

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    let find = {
        deleted: false 
    }

    const records = await Role.find(find)

    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records
    })
}

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    try {
        const permissions = JSON.parse(req.body.permissions)

        for (const item of permissions) {
            const id = item.id
            const permissions = item.permissions 

            await Role.updateOne({ _id: id}, { permissions: permissions })
        }

        req.flash("success", "Cập nhật phân quyền thành công!")
        res.redirect("back")
    } catch (error) {
        req.flash("error", "Cập nhật phân quyền thất bại!")
    }
}

// [GET] /admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id

        const data = await Role.findOne({_id: id, deleted: false})

        res.render("admin/pages/roles/detail", {
            pageTitle: "Chi tiết nhóm quyền",
            data: data
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}

// [DELETE] /admin/roles/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        
        await Role.updateOne({ _id: id }, { deleted: true, deleteAt: new Date() })

        req.flash("success", "Đã xóa nhóm quyền thành công!")
    } catch (error) {
        req.flash("error", "Xóa nhóm quyền thất bại!")
    }
    res.redirect("back")
}